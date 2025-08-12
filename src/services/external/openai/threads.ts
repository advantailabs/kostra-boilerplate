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
  initialMessageAttachments?: Array<{
    file_id: string;
    tools?: Array<{ type: 'file_search' | 'code_interpreter' }>;
  }>;
}

export interface AddMessageParams {
  threadId: string;
  content: string;
  role?: 'user' | 'assistant';
  metadata?: Record<string, string>;
  attachments?: Array<{
    file_id: string;
    tools?: Array<{ type: 'file_search' | 'code_interpreter' }>;
  }>;
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
          attachments:
            params.initialMessageAttachments && params.initialMessageAttachments.length > 0
              ? (params.initialMessageAttachments as any)
              : undefined,
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
      attachments:
        params.attachments && params.attachments.length > 0
          ? (params.attachments as any)
          : undefined,
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
 * Streams assistant response for a thread run
 */
export const streamAssistantResponse = async (params: RunAssistantParams): Promise<any> => {
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
