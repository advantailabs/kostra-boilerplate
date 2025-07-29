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

export interface FileCitation {
  type: 'file_citation';
  text: string;
  start_index: number;
  end_index: number;
  file_citation: {
    file_id: string;
  };
}

export interface CitationFile {
  openaiFileId: string;
  fileId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  citationText: string;
  startIndex: number;
  endIndex: number;
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
    citations?: CitationFile[];
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
      tool_choice: {
        type: 'file_search',
      },
    });

    let assistantMessageId: string | undefined;
    let runId: string | undefined;
    let accumulatedContent = '';
    let citations: CitationFile[] = [];

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
        case 'thread.message.completed':
          // Extract citations from the completed message
          if (event.data.content && event.data.content.length > 0) {
            const firstContent = event.data.content[0];
            if (firstContent.type === 'text' && firstContent.text?.annotations) {
              const fileCitations = firstContent.text.annotations.filter(
                (annotation: any) => annotation.type === 'file_citation'
              ) as FileCitation[];

              // Process citations to get file details
              if (fileCitations.length > 0) {
                const { findFileByOpenaiFileId } = await import('@/services/repositories/file');

                const citationPromises = fileCitations.map(async citation => {
                  const fileResult = await findFileByOpenaiFileId(citation.file_citation.file_id);
                  if (fileResult.success && fileResult.data) {
                    return {
                      openaiFileId: citation.file_citation.file_id,
                      fileId: fileResult.data.id,
                      originalName: fileResult.data.originalName,
                      filename: fileResult.data.filename,
                      mimeType: fileResult.data.mimeType,
                      size: fileResult.data.size,
                      citationText: citation.text,
                      startIndex: citation.start_index,
                      endIndex: citation.end_index,
                    };
                  }
                  return null;
                });

                const citationResults = await Promise.all(citationPromises);
                citations = citationResults.filter(
                  (citation): citation is CitationFile => citation !== null
                );
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
            citations,
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
