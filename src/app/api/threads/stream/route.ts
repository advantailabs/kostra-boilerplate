import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { streamAssistantRun } from '@/services/external/openai/messages';
import { createThread as createOpenAIThread } from '@/services/external/openai/threads';
import { generateThreadTitle as generateOpenAITitle } from '@/services/external/openai/title-generator';
import { createMessage } from '@/services/repositories/message';
import { findPersonaByUserAndId } from '@/services/repositories/persona';
import { createThread, deleteThread, updateThreadOpenAIId } from '@/services/repositories/thread';
import { getUserByClerkId } from '@/services/repositories/user';
import { createThreadSchema } from '@/validations/chat';

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

    const { personaId, message: initialMessage } = validationResult.data;

    // Verify persona exists and belongs to user
    const persona = await findPersonaByUserAndId(user.id, personaId);
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

    // Create OpenAI thread with initial message
    const openaiThreadResult = await createOpenAIThread({
      assistantId: persona.openaiAssistantId,
      initialMessage,
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
    await createMessage({
      threadId: thread.id,
      role: 'user',
      content: initialMessage,
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
            openaiThreadResult.data!.id,
            persona.openaiAssistantId!,
            initialMessage
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

                // Save the complete assistant response to database
                await createMessage({
                  threadId: thread.id,
                  role: 'assistant',
                  content: fullResponse,
                  openaiMessageId: assistantMessageId,
                });

                // Send completion signal
                const completionData = JSON.stringify({
                  type: 'completed',
                  threadId: thread.id,
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
    console.error('Error in thread streaming endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
