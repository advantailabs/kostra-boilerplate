import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CreateAssistantParams {
  name: string;
  description: string;
  instructions: string;
  model?: string;
  temperature?: number;
  tools?: Array<{ type: 'code_interpreter' | 'file_search' | 'function' }>;
  tool_resources?: {
    file_search?: {
      vector_store_ids?: string[];
    };
    code_interpreter?: {
      file_ids?: string[];
    };
  };
}

export interface UpdateAssistantParams {
  assistantId: string;
  name?: string;
  description?: string;
  instructions?: string;
  model?: string;
  tools?: Array<{ type: 'code_interpreter' | 'file_search' | 'function' }>;
}

export interface AssistantServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new OpenAI assistant
 */
export const createAssistant = async (
  params: CreateAssistantParams
): Promise<AssistantServiceResult<OpenAI.Beta.Assistants.Assistant>> => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: params.name,
      description: params.description,
      instructions: params.instructions,
      model: params.model || 'gpt-4.1-2025-04-14',
      temperature: params.temperature || 0.3,
      tools: (params.tools || [{ type: 'code_interpreter' }]) as any,
      tool_resources: params.tool_resources as any,
    });

    return {
      success: true,
      data: assistant,
    };
  } catch (error) {
    console.error('Error creating OpenAI assistant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create assistant',
    };
  }
};

/**
 * Updates an existing OpenAI assistant
 */
export const updateAssistant = async (
  params: UpdateAssistantParams
): Promise<AssistantServiceResult<OpenAI.Beta.Assistants.Assistant>> => {
  try {
    const updateData: any = {};

    if (params.name !== undefined) updateData.name = params.name;
    if (params.description !== undefined) updateData.description = params.description;
    if (params.instructions !== undefined) updateData.instructions = params.instructions;
    if (params.model !== undefined) updateData.model = params.model;
    if (params.tools !== undefined) updateData.tools = params.tools as any;

    const assistant = await openai.beta.assistants.update(params.assistantId, updateData);

    return {
      success: true,
      data: assistant,
    };
  } catch (error) {
    console.error('Error updating OpenAI assistant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update assistant',
    };
  }
};

/**
 * Retrieves an OpenAI assistant by ID
 */
export const getAssistant = async (
  assistantId: string
): Promise<AssistantServiceResult<OpenAI.Beta.Assistants.Assistant>> => {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    return {
      success: true,
      data: assistant,
    };
  } catch (error) {
    console.error('Error retrieving OpenAI assistant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve assistant',
    };
  }
};

/**
 * Deletes an OpenAI assistant
 */
export const deleteAssistant = async (
  assistantId: string
): Promise<AssistantServiceResult<{ deleted: boolean; id: string }>> => {
  try {
    const result = await openai.beta.assistants.delete(assistantId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error deleting OpenAI assistant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete assistant',
    };
  }
};

/**
 * Lists all assistants for the organization
 */
export const listAssistants = async (
  after?: string,
  limit: number = 20
): Promise<AssistantServiceResult<OpenAI.Beta.Assistants.AssistantsPage>> => {
  try {
    const params: any = { limit };
    if (after) params.after = after;

    const assistants = await openai.beta.assistants.list(params);

    return {
      success: true,
      data: assistants,
    };
  } catch (error) {
    console.error('Error listing OpenAI assistants:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list assistants',
    };
  }
};
