import { NextRequest } from 'next/server';

import { getUserIdFromHeaders } from '@/lib/auth/jwt';
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
import { CreditService } from '@/services/internal/credit';
import { uploadFileService } from '@/services/internal/file';
import { addFilesToMessage, createMessageWithCitations } from '@/services/repositories/message';
import {
  findByIdWithMessagesInternal,
  findByUserAndId,
  updateThreadTimestamp,
} from '@/services/repositories/thread';
import { getUserById } from '@/services/repositories/user';
import { addMessageSchema } from '@/validations/chat';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return createPreflightResponse(request);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return validationErrorResponse('Invalid input data', [
        { field: 'id', message: 'Thread ID must be a number' },
      ]);
    }

    // Verify thread exists and belongs to user
    const thread = await findByUserAndId(user.id, threadId);
    if (!thread) {
      return notFoundResponse('Thread not found or access denied');
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addMessageSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid input data',
        validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      );
    }

    const { content: messageContent, files } = validationResult.data;

    // Get thread with messages for OpenAI thread ID
    const threadWithMessages = await findByIdWithMessagesInternal(threadId);
    if (!threadWithMessages) {
      return notFoundResponse('Thread not found');
    }

    // Check if persona has OpenAI assistant
    if (!threadWithMessages.persona?.openaiAssistantId) {
      return errorResponse('Thread persona does not have an associated OpenAI assistant', 400);
    }

    // Check if thread has OpenAI thread ID
    if (!threadWithMessages.openaiThreadId) {
      return errorResponse('Thread does not have an associated OpenAI thread', 400);
    }

    // Check if user has sufficient credits
    const hasCredits = await CreditService.hassufficientCredits(user.id, CREDIT_COSTS.CHAT);
    if (!hasCredits) {
      return insufficientCreditsResponse();
    }

    // If client sent files, upload them to OpenAI and create DB file records
    let openaiAttachments: Array<{ file_id: string; tools?: Array<{ type: 'file_search' }> }> = [];
    const uploadedFileIds: number[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(async f => {
        const mockFile = new File([], f.originalName, { type: f.mimeType });
        Object.defineProperty(mockFile, 'size', { value: f.size });
        const result = await uploadFileService({
          userId: user.id,
          file: mockFile,
          s3Key: f.s3Key,
          uploadPurpose: f.uploadPurpose || 'MessageAttachment',
        });
        if (!result.success) throw new Error(`Failed to prepare attachment ${f.originalName}`);
        uploadedFileIds.push(result.data!.id);
        return { file_id: result.data!.openaiFileId as string };
      });
      const uploaded = await Promise.all(uploadPromises);
      openaiAttachments = uploaded.map(u => ({
        file_id: u.file_id,
        tools: [{ type: 'file_search' }],
      }));
    }

    // Create user message in database first
    const userMessage = await createMessageWithCitations({
      threadId,
      role: 'user',
      content: messageContent,
      openaiMessageId: undefined, // OpenAI will create the message
      citations: [], // No citations for user messages
    });

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
            threadWithMessages.openaiThreadId!,
            threadWithMessages.persona!.openaiAssistantId!,
            messageContent,
            openaiAttachments
          );

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
                  threadId,
                  role: 'assistant',
                  content: fullResponse,
                  openaiMessageId: assistantMessageId,
                  citations: storedCitations,
                });

                // Update thread timestamp
                await updateThreadTimestamp(threadId);

                // Deduct credits after successful message completion
                await CreditService.deductCredits({
                  userId: user.id,
                  amount: CREDIT_COSTS.CHAT,
                  operation: 'CHAT',
                  objectId: assistantMessage.id.toString(),
                  description: `Chat message in thread ${threadId}`,
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
    console.error('Error in streaming endpoint:', error);
    return internalServerErrorResponse();
  }
}
