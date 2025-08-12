import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { streamAssistantRun } from '@/services/external/openai/messages';
import { createThread as createOpenAIThread } from '@/services/external/openai/threads';
import { generateThreadTitle as generateOpenAITitle } from '@/services/external/openai/title-generator';
import { uploadFileService } from '@/services/internal/file';
import { addFilesToMessage, createMessageWithCitations } from '@/services/repositories/message';
import { findPersonaByUserAndIdInternal } from '@/services/repositories/persona';
import { createThread, deleteThread, updateThreadOpenAIId } from '@/services/repositories/thread';
import { getUserByClerkId } from '@/services/repositories/user';
import { createThreadSchema } from '@/validations/chat';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createThreadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid input data',
          details: validationResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      personaId,
      message: initialMessage,
      files,
    } = validationResult.data as {
      personaId: number;
      message: string;
      files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>;
    };

    // Verify persona exists and belongs to user
    const persona = await findPersonaByUserAndIdInternal(user.id, personaId);
    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found', message: 'Persona not found' },
        { status: 404 }
      );
    }

    // Check if persona has OpenAI assistant ID
    if (!persona.openaiAssistantId) {
      return NextResponse.json(
        {
          error: 'Assistant not available',
          message: 'Persona does not have an associated OpenAI assistant',
        },
        { status: 400 }
      );
    }

    // Generate title from message using OpenAI
    const titleResult = await generateOpenAITitle(initialMessage);
    const title = titleResult.success ? titleResult.data! : `Chat with ${persona.name}`;

    // Create thread in database
    const thread = await createThread({
      userId: user.id,
      personaId,
      title,
    });

    // If client sent files, upload them to OpenAI and create DB file records
    let openaiAttachments: Array<{ file_id: string; tools?: Array<{ type: 'file_search' }> }> = [];
    const uploadedFileIds: number[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(async f => {
        // Create a mock File for metadata
        const mockFile = new File([], f.originalName, { type: f.mimeType });
        Object.defineProperty(mockFile, 'size', { value: f.size });

        const result = await uploadFileService({
          userId: user.id,
          file: mockFile,
          s3Key: f.s3Key,
        });

        if (!result.success) {
          throw new Error(`Failed to prepare attachment ${f.originalName}: ${result.error}`);
        }

        uploadedFileIds.push(result.data!.id);
        return { file_id: result.data!.openaiFileId as string };
      });

      const uploaded = await Promise.all(uploadPromises);
      openaiAttachments = uploaded.map(u => ({
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
        userId: user.id.toString(),
        personaId: personaId.toString(),
      },
    });

    if (!openaiThreadResult.success) {
      // If OpenAI thread creation fails, delete the DB thread and return error
      await deleteThread(thread.id);
      return NextResponse.json(
        { error: 'Failed to create OpenAI thread', message: openaiThreadResult.error },
        { status: 500 }
      );
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
                await createMessageWithCitations({
                  threadId: thread.id,
                  role: 'assistant',
                  content: fullResponse,
                  openaiMessageId: assistantMessageId,
                  citations: storedCitations,
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
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in thread streaming endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
