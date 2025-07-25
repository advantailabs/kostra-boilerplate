import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MessageServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AssistantRunResponse {
  content: string;
  role: 'assistant';
  runId: string;
  messageId: string;
}

/**
 * Streams an assistant run response in real-time
 */
export const streamAssistantRun = async function* (
  threadId: string,
  assistantId: string,
  messageContent: string
): AsyncGenerator<
  {
    type: 'chunk' | 'completed' | 'error';
    content?: string;
    runId?: string;
    messageId?: string;
    error?: string;
  },
  void,
  unknown
> {
  try {
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: messageContent,
    });

    // Create and stream the run
    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    let assistantMessageId: string | undefined;
    let runId: string | undefined;
    let accumulatedContent = '';

    for await (const event of stream) {
      switch (event.event) {
        case 'thread.run.created':
          runId = event.data.id;
          break;

        case 'thread.message.created':
          if (event.data.role === 'assistant') {
            assistantMessageId = event.data.id;
          }
          break;

        case 'thread.message.delta':
          if (event.data.delta.content) {
            for (const contentDelta of event.data.delta.content) {
              if (contentDelta.type === 'text' && contentDelta.text?.value) {
                const chunk = contentDelta.text.value;
                accumulatedContent += chunk;
                yield {
                  type: 'chunk',
                  content: chunk,
                };
              }
            }
          }
          break;

        case 'thread.run.completed':
          yield {
            type: 'completed',
            content: accumulatedContent,
            runId,
            messageId: assistantMessageId,
          };
          return;

        case 'thread.run.failed':
        case 'thread.run.cancelled':
        case 'thread.run.expired':
          yield {
            type: 'error',
            error: `Run ${event.data.status}: ${event.data.last_error?.message || 'Unknown error'}`,
          };
          return;

        case 'error':
          yield {
            type: 'error',
            error: 'Stream error occurred',
          };
          return;
      }
    }
  } catch (error) {
    console.error('Error streaming assistant run:', error);
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Failed to stream assistant run',
    };
  }
};
