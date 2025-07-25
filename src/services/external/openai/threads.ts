/* eslint-disable no-await-in-loop */
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ThreadServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateThreadParams {
  assistantId: string;
  initialMessage?: string;
  metadata?: Record<string, string>;
}

export interface AddMessageParams {
  threadId: string;
  content: string;
  role?: 'user' | 'assistant';
  metadata?: Record<string, string>;
}

export interface RunAssistantParams {
  threadId: string;
  assistantId: string;
  additionalInstructions?: string;
  temperature?: number;
}

/**
 * Creates a new OpenAI thread
 */
export const createThread = async (
  params: CreateThreadParams
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Thread>> => {
  try {
    const threadData: OpenAI.Beta.Threads.ThreadCreateParams = {
      metadata: params.metadata,
    };

    // Add initial message if provided
    if (params.initialMessage) {
      threadData.messages = [
        {
          role: 'user',
          content: params.initialMessage,
        },
      ];
    }

    const thread = await openai.beta.threads.create(threadData);

    return {
      success: true,
      data: thread,
    };
  } catch (error) {
    console.error('Error creating OpenAI thread:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create thread',
    };
  }
};

/**
 * Adds a message to an existing OpenAI thread
 */
export const addMessageToThread = async (
  params: AddMessageParams
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Messages.Message>> => {
  try {
    const message = await openai.beta.threads.messages.create(params.threadId, {
      role: params.role || 'user',
      content: params.content,
      metadata: params.metadata,
    });

    return {
      success: true,
      data: message,
    };
  } catch (error) {
    console.error('Error adding message to thread:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add message to thread',
    };
  }
};

/**
 * Retrieves messages from a thread
 */
export const getThreadMessages = async (
  threadId: string,
  limit?: number,
  order?: 'asc' | 'desc'
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Messages.Message[]>> => {
  try {
    const messages = await openai.beta.threads.messages.list(threadId, {
      limit: limit || 100,
      order: order || 'asc',
    });

    return {
      success: true,
      data: messages.data,
    };
  } catch (error) {
    console.error('Error retrieving thread messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve thread messages',
    };
  }
};

/**
 * Runs an assistant on a thread
 */
export const runAssistant = async (
  params: RunAssistantParams
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Runs.Run>> => {
  try {
    const run = await openai.beta.threads.runs.create(params.threadId, {
      assistant_id: params.assistantId,
      additional_instructions: params.additionalInstructions,
      temperature: params.temperature || 0.3,
    });

    return {
      success: true,
      data: run,
    };
  } catch (error) {
    console.error('Error running assistant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run assistant',
    };
  }
};

/**
 * Gets the status of a run
 */
export const getRunStatus = async (
  threadId: string,
  runId: string
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Runs.Run>> => {
  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    return {
      success: true,
      data: run,
    };
  } catch (error) {
    console.error('Error getting run status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get run status',
    };
  }
};

/**
 * Waits for a run to complete and returns the final status
 */
export const waitForRunCompletion = async (
  threadId: string,
  runId: string,
  maxWaitTime: number = 120000, // 2 minutes default
  pollInterval: number = 1000 // 1 second default
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Runs.Run>> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const runResult = await getRunStatus(threadId, runId);

    if (!runResult.success) {
      return runResult;
    }

    const run = runResult.data!;

    // Check if run is complete
    if (run.status === 'completed') {
      return {
        success: true,
        data: run,
      };
    }

    // Check if run failed
    if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
      return {
        success: false,
        error: `Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`,
      };
    }

    // Wait before polling again
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>(resolve => setTimeout(resolve, pollInterval));
  }

  return {
    success: false,
    error: 'Run timed out waiting for completion',
  };
};

/**
 * Streams assistant response for a thread run
 */
export const streamAssistantResponse = async (
  params: RunAssistantParams
): Promise<OpenAI.Beta.AssistantStream> => {
  try {
    const stream = openai.beta.threads.runs.stream(params.threadId, {
      assistant_id: params.assistantId,
      additional_instructions: params.additionalInstructions,
      temperature: params.temperature || 0.3,
    });

    return stream;
  } catch (error) {
    console.error('Error streaming assistant response:', error);
    throw error;
  }
};

/**
 * Retrieves a specific thread
 */
export const getThread = async (
  threadId: string
): Promise<ThreadServiceResult<OpenAI.Beta.Threads.Thread>> => {
  try {
    const thread = await openai.beta.threads.retrieve(threadId);

    return {
      success: true,
      data: thread,
    };
  } catch (error) {
    console.error('Error retrieving thread:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve thread',
    };
  }
};

/**
 * Deletes a thread
 */
export const deleteThread = async (threadId: string): Promise<ThreadServiceResult<boolean>> => {
  try {
    await openai.beta.threads.delete(threadId);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error('Error deleting thread:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete thread',
    };
  }
};
