import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { streamAssistantRun } from '@/services/external/openai/messages';
import { createMessage } from '@/services/repositories/message';
import {
  findByIdWithMessages,
  findByUserAndId,
  updateThreadTimestamp,
} from '@/services/repositories/thread';
import { getUserByClerkId } from '@/services/repositories/user';
import { addMessageSchema } from '@/validations/chat';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return NextResponse.json(
        { error: 'Invalid thread ID', message: 'Thread ID must be a number' },
        { status: 400 }
      );
    }

    // Verify thread exists and belongs to user
    const thread = await findByUserAndId(user.id, threadId);
    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found', message: 'Thread not found or access denied' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addMessageSchema.safeParse(body);

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

    const { content: messageContent } = validationResult.data;

    // Get thread with messages for OpenAI thread ID
    const threadWithMessages = await findByIdWithMessages(threadId);
    if (!threadWithMessages) {
      return NextResponse.json(
        { error: 'Thread not found', message: 'Thread not found' },
        { status: 404 }
      );
    }

    // Check if persona has OpenAI assistant
    if (!threadWithMessages.persona?.openaiAssistantId) {
      return NextResponse.json(
        {
          error: 'Assistant not available',
          message: 'Thread persona does not have an associated OpenAI assistant',
        },
        { status: 400 }
      );
    }

    // Check if thread has OpenAI thread ID
    if (!threadWithMessages.openaiThreadId) {
      return NextResponse.json(
        {
          error: 'OpenAI thread not found',
          message: 'Thread does not have an associated OpenAI thread',
        },
        { status: 400 }
      );
    }

    // Create user message in database first
    await createMessage({
      threadId,
      role: 'user',
      content: messageContent,
      openaiMessageId: undefined, // OpenAI will create the message
    });

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
            messageContent
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

                // Save the complete assistant response to database
                await createMessage({
                  threadId,
                  role: 'assistant',
                  content: fullResponse,
                  openaiMessageId: assistantMessageId,
                });

                // Update thread timestamp
                await updateThreadTimestamp(threadId);

                // Send completion signal
                const completionData = JSON.stringify({
                  type: 'completed',
                  messageId: assistantMessageId,
                  fullContent: fullResponse,
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
    console.error('Error in streaming endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
