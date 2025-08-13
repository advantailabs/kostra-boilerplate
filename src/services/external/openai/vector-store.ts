import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CreateVectorStoreParams {
  name: string;
  expiresAfter?: { anchor: 'last_active_at'; days: number };
}

export interface UpdateVectorStoreParams {
  vectorStoreId: string;
  name?: string;
  expiresAfter?: { anchor: 'last_active_at'; days: number } | null;
}

export interface AddFileToVectorStoreParams {
  vectorStoreId: string;
  fileId: string;
}

export interface DeleteFileFromVectorStoreParams {
  vectorStoreId: string;
  fileId: string;
}

export interface VectorStoreServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new OpenAI vector store
 */
export const createVectorStore = async (
  params: CreateVectorStoreParams
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const vectorStore = await openai.vectorStores.create({
      name: params.name,
      expires_after: params.expiresAfter,
    });

    return {
      success: true,
      data: vectorStore,
    };
  } catch (error) {
    console.error('Error creating OpenAI vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create vector store',
    };
  }
};

/**
 * Retrieves a vector store by ID
 */
export const getVectorStore = async (
  vectorStoreId: string
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const vectorStore = await openai.vectorStores.retrieve(vectorStoreId);

    return {
      success: true,
      data: vectorStore,
    };
  } catch (error) {
    console.error('Error retrieving OpenAI vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve vector store',
    };
  }
};

/**
 * Updates a vector store
 */
export const updateVectorStore = async (
  params: UpdateVectorStoreParams
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const updates: any = {};
    if (params.name !== undefined) updates.name = params.name;
    if (params.expiresAfter !== undefined) updates.expires_after = params.expiresAfter;

    const vectorStore = await openai.vectorStores.update(params.vectorStoreId, updates);

    return {
      success: true,
      data: vectorStore,
    };
  } catch (error) {
    console.error('Error updating OpenAI vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update vector store',
    };
  }
};

/**
 * Deletes a vector store
 */
export const deleteVectorStore = async (
  vectorStoreId: string
): Promise<VectorStoreServiceResult<{ deleted: boolean; id: string }>> => {
  try {
    const result = await openai.vectorStores.delete(vectorStoreId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error deleting OpenAI vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete vector store',
    };
  }
};

/**
 * Lists all vector stores
 */
export const listVectorStores = async (
  after?: string,
  limit: number = 20
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const params: any = { limit };
    if (after) params.after = after;

    const vectorStores = await openai.vectorStores.list(params);

    return {
      success: true,
      data: vectorStores,
    };
  } catch (error) {
    console.error('Error listing OpenAI vector stores:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list vector stores',
    };
  }
};

/**
 * Adds a file to a vector store
 */
export const addFileToVectorStore = async (
  params: AddFileToVectorStoreParams
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const fileBatch = await openai.vectorStores.fileBatches.create(params.vectorStoreId, {
      file_ids: [params.fileId],
    });

    return {
      success: true,
      data: fileBatch,
    };
  } catch (error) {
    console.error('Error adding file to vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add file to vector store',
    };
  }
};

/**
 * Deletes a file from a vector store
 */
export const deleteFileFromVectorStore = async (
  params: DeleteFileFromVectorStoreParams
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const result = await openai.vectorStores.files.delete(params.fileId, {
      vector_store_id: params.vectorStoreId,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error deleting file from vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file from vector store',
    };
  }
};

/**
 * Lists files in a vector store
 */
export const listVectorStoreFiles = async (
  vectorStoreId: string,
  after?: string,
  limit: number = 20
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const params: any = { limit };
    if (after) params.after = after;

    const files = await openai.vectorStores.files.list(vectorStoreId, params);

    return {
      success: true,
      data: files,
    };
  } catch (error) {
    console.error('Error listing vector store files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list vector store files',
    };
  }
};

/**
 * Searches a vector store for relevant files/content.
 * Note: Uses an untyped SDK call as the official method may be subject to change.
 */
export interface VectorStoreSearchParams {
  vectorStoreId: string;
  query: string;
  limit?: number;
}

export const searchVectorStore = async (
  params: VectorStoreSearchParams
): Promise<VectorStoreServiceResult<any>> => {
  try {
    const result = await openai.vectorStores.search(params.vectorStoreId, {
      query: params.query,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error searching OpenAI vector store:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search vector store',
    };
  }
};
