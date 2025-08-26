import { NextRequest, NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/auth/jwt';
import { CREDIT_COSTS } from '@/lib/constants/credits';
import { createPreflightResponse, withCors } from '@/lib/routes/cors';
import {
  errorResponse,
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { streamAssistantRun } from '@/services/external/openai/messages';
import { createThread as createOpenAIThread } from '@/services/external/openai/threads';
import { generateThreadTitle as generateOpenAITitle } from '@/services/external/openai/title-generator';
import { CreditService } from '@/services/internal/credit';
import { uploadFileService } from '@/services/internal/file';
import { addFilesToMessage, createMessageWithCitations } from '@/services/repositories/message';
import { findPersonaByUserAndIdInternal } from '@/services/repositories/persona';
import { createThread, deleteThread, updateThreadOpenAIId } from '@/services/repositories/thread';
import { createThreadSchema } from '@/validations/chat';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return createPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createThreadSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid input data',
        validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      );
    }

    const { personaId, message: initialMessage, files } = validationResult.data;

    // Verify persona exists and belongs to user
    const persona = await findPersonaByUserAndIdInternal(authUser.userId, personaId);
    if (!persona) {
      return notFoundResponse('Persona not found');
    }

    // Check if persona has OpenAI assistant ID
    if (!persona.openaiAssistantId) {
      return errorResponse('Persona does not have an associated OpenAI assistant', 400);
    }

    // Check if user has sufficient credits before starting a chat
    const hasCredits = await CreditService.hassufficientCredits(authUser.userId, CREDIT_COSTS.CHAT);
    if (!hasCredits) {
      return insufficientCreditsResponse();
    }

    // Generate title from message using OpenAI
    const titleResult = await generateOpenAITitle(initialMessage);
    const title = titleResult.success ? titleResult.data! : `Chat with ${persona.name}`;

    // Create thread in database
    const thread = await createThread({
      userId: authUser.userId,
      personaId,
      title,
    });

    // If client sent files, upload them to OpenAI and create DB file records
    let openaiAttachments: Array<{ file_id: string; tools?: Array<{ type: 'file_search' }> }> = [];
    const uploadedFileIds: number[] = [];

    if (files && files.length > 0) {
      const perFileErrors: Array<{ name: string; reason: string }> = [];

      const uploadPromises = files.map(async f => {
        try {
          // Create a mock File for metadata
          const mockFile = new File([], f.originalName, { type: f.mimeType });
          Object.defineProperty(mockFile, 'size', { value: f.size });

          const result = await uploadFileService({
            userId: authUser.userId,
            file: mockFile,
            s3Key: f.s3Key,
            uploadPurpose: f.uploadPurpose || 'MessageAttachment',
          });

          if (!result.success) {
            throw new Error(`Failed to prepare attachment ${f.originalName}: ${result.error}`);
          }

          uploadedFileIds.push(result.data!.id);
          return { file_id: result.data!.openaiFileId as string };
        } catch (err) {
          const reason = err instanceof Error ? err.message : 'Unknown error';
          perFileErrors.push({ name: f.originalName, reason });
          console.warn('File upload failed:', { file: f.originalName, reason });
          return null;
        }
      });

      const uploaded = await Promise.all(uploadPromises);
      const successfulUploads = uploaded.filter((u): u is { file_id: string } => u !== null);

      if (successfulUploads.length === 0) {
        // All uploads failed — clean up the created thread and return an aggregated error
        await deleteThread(thread.id);
        return NextResponse.json(
          {
            error: 'All file uploads failed',
            message:
              'Unable to upload any of the provided attachments. Please try again or remove the files.',
            details: perFileErrors,
          },
          { status: 400 }
        );
      }

      openaiAttachments = successfulUploads.map(u => ({
        file_id: u.file_id,
        tools: [{ type: 'file_search' }],
      }));
    }

    // Create OpenAI thread with initial message and attachments
    const openaiThreadResult = await createOpenAIThread({
      assistantId: persona.openaiAssistantId,
      initialMessage,
      initialMessageAttachments: openaiAttachments,
      metadata: {
        dbThreadId: thread.id.toString(),
        userId: authUser.userId.toString(),
        personaId: personaId.toString(),
      },
    });

    if (!openaiThreadResult.success) {
      // If OpenAI thread creation fails, delete the DB thread and return error
      await deleteThread(thread.id);
      return errorResponse('Failed to create OpenAI thread', 500);
    }

    // Update thread with OpenAI thread ID
    await updateThreadOpenAIId(thread.id, openaiThreadResult.data!.id);

    // Create user message in database
    const userMessage = await createMessageWithCitations({
      threadId: thread.id,
      role: 'user',
      content: initialMessage,
      openaiMessageId: undefined, // OpenAI will create the message
    });

    // Link uploaded files to the message
    if (uploadedFileIds.length > 0) {
      await addFilesToMessage(userMessage.id, uploadedFileIds);
    }

    // Create a streaming response
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          let assistantMessageId: string | undefined;

          // Generate streaming response from OpenAI Assistant
          const responseGenerator = streamAssistantRun(
            openaiThreadResult.data!.id,
            persona.openaiAssistantId!,
            initialMessage,
            openaiAttachments
          );

          // Send thread creation info first
          const threadData = JSON.stringify({
            type: 'thread_created',
            threadId: thread.id,
            threadTitle: title,
          });
          controller.enqueue(encoder.encode(`data: ${threadData}\n\n`));

          // Stream the response chunks
          for await (const chunk of responseGenerator) {
            switch (chunk.type) {
              case 'chunk':
                if (chunk.content) {
                  fullResponse += chunk.content;

                  // Send chunk to client
                  const data = JSON.stringify({
                    type: 'chunk',
                    content: chunk.content,
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
                break;

              case 'completed':
                assistantMessageId = chunk.messageId;

                // Convert citations to stored format
                const storedCitations = chunk.citations?.map(citation => ({
                  openaiFileId: citation.openaiFileId,
                  fileId: citation.fileId,
                  originalName: citation.originalName,
                  filename: citation.filename,
                  mimeType: citation.mimeType,
                  size: citation.size,
                  citationText: citation.citationText,
                  startIndex: citation.startIndex,
                  endIndex: citation.endIndex,
                }));

                // Save the complete assistant response to database with citations
                const assistantMessage = await createMessageWithCitations({
                  threadId: thread.id,
                  role: 'assistant',
                  content: fullResponse,
                  openaiMessageId: assistantMessageId,
                  citations: storedCitations,
                });

                // Deduct credits after successful message completion
                await CreditService.deductCredits({
                  userId: authUser.userId,
                  amount: CREDIT_COSTS.CHAT,
                  operation: 'CHAT',
                  objectId: assistantMessage.id.toString(),
                  description: `Chat message in thread ${thread.id}`,
                });

                // Convert citations to public format (exclude openaiFileId)
                const publicCitations =
                  chunk.citations?.map(citation => ({
                    fileId: citation.fileId,
                    originalName: citation.originalName,
                    filename: citation.filename,
                    mimeType: citation.mimeType,
                    size: citation.size,
                    citationText: citation.citationText,
                    startIndex: citation.startIndex,
                    endIndex: citation.endIndex,
                  })) || [];

                // Send completion signal with clean citations
                const completionData = JSON.stringify({
                  type: 'completed',
                  threadId: thread.id,
                  messageId: assistantMessageId,
                  fullContent: fullResponse,
                  citations: publicCitations,
                });
                controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));

                // End the stream
                controller.close();
                return;

              case 'error':
                // Send error to client
                const errorData = JSON.stringify({
                  type: 'error',
                  error: chunk.error || 'Unknown error occurred',
                });
                controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                controller.close();
                return;
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);

          // Send error to client
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: withCors(request, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }),
    });
  } catch (error) {
    console.error('Error in thread streaming endpoint:', error);
    return internalServerErrorResponse();
  }
}
