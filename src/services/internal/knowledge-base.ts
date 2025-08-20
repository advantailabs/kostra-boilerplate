import { deleteFile } from '@/services/external/openai/files';
import { createVectorStore, deleteVectorStore } from '@/services/external/openai/vector-store';
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  findKnowledgeBaseById,
  findKnowledgeBaseByIdPublic,
  findKnowledgeBasesByUserId,
  findKnowledgeBasesByUserIdPublic,
  getKnowledgeBaseFiles,
  updateKnowledgeBase,
} from '@/services/repositories/knowledge-base';
import {
  CreateKnowledgeBaseData,
  KnowledgeBaseWithFiles,
  UpdateKnowledgeBaseData,
} from '@/types/chat';
import {
  addFileToKnowledgeBaseService as addFileToKnowledgeBaseFromFileService,
  removeFileFromKnowledgeBaseService as removeFileFromKnowledgeBaseFromFileService,
} from './file';

export interface KnowledgeBaseServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const createKnowledgeBaseService = async (
  _userId: number,
  data: CreateKnowledgeBaseData
): Promise<KnowledgeBaseServiceResult<any>> => {
  try {
    // Create vector store first if not provided
    let finalVectorStoreId = data.vectorStoreId;

    if (!finalVectorStoreId) {
      const vectorStoreResult = await createVectorStore({
        name: `${data.title.trim()} Knowledge Base`,
      });

      if (!vectorStoreResult.success || !vectorStoreResult.data) {
        return {
          success: false,
          error: `Failed to create vector store: ${vectorStoreResult.error}`,
        };
      }

      finalVectorStoreId = vectorStoreResult.data.id;
    }

    // Create knowledge base with vector store ID
    const knowledgeBaseData = {
      ...data,
      vectorStoreId: finalVectorStoreId,
    };

    const result = await createKnowledgeBase(knowledgeBaseData);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in createKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to create knowledge base',
    };
  }
};

const getUserKnowledgeBasesService = async (
  userId: number
): Promise<KnowledgeBaseServiceResult<any[]>> => {
  try {
    const result = await findKnowledgeBasesByUserId(userId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in getUserKnowledgeBasesService:', error);
    return {
      success: false,
      error: 'Failed to fetch knowledge bases',
    };
  }
};

// Public version that excludes vectorStoreId
const getUserKnowledgeBasesPublicService = async (
  userId: number
): Promise<KnowledgeBaseServiceResult<any[]>> => {
  try {
    const result = await findKnowledgeBasesByUserIdPublic(userId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in getUserKnowledgeBasesPublicService:', error);
    return {
      success: false,
      error: 'Failed to fetch knowledge bases',
    };
  }
};

const getKnowledgeBaseByIdService = async (
  id: number
): Promise<KnowledgeBaseServiceResult<KnowledgeBaseWithFiles | null>> => {
  try {
    const result = await findKnowledgeBaseById(id);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in getKnowledgeBaseByIdService:', error);
    return {
      success: false,
      error: 'Failed to fetch knowledge base',
    };
  }
};

// Public version that excludes vectorStoreId
const getKnowledgeBaseByIdPublicService = async (
  id: number
): Promise<KnowledgeBaseServiceResult<KnowledgeBaseWithFiles | null>> => {
  try {
    const result = await findKnowledgeBaseByIdPublic(id);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in getKnowledgeBaseByIdPublicService:', error);
    return {
      success: false,
      error: 'Failed to fetch knowledge base',
    };
  }
};

const updateKnowledgeBaseService = async (
  id: number,
  data: UpdateKnowledgeBaseData,
  currentUserId?: number
): Promise<KnowledgeBaseServiceResult<any>> => {
  try {
    const result = await updateKnowledgeBase(id, data, currentUserId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in updateKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to update knowledge base',
    };
  }
};

const deleteKnowledgeBaseService = async (
  id: number,
  deleteFiles: boolean = false,
  currentUserId?: number
): Promise<KnowledgeBaseServiceResult<boolean>> => {
  try {
    const result = await deleteKnowledgeBase(id, deleteFiles, currentUserId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Always delete the vector store if it exists
    if (result.data?.vectorStoreId) {
      console.log('Deleting vector store:', result.data.vectorStoreId);
      try {
        await deleteVectorStore(result.data.vectorStoreId);
      } catch (error) {
        console.error('Error deleting vector store:', error);
        // Continue with deletion even if vector store deletion fails
      }
    }

    // If deleteFiles is true, also delete the OpenAI files
    if (deleteFiles && result.data?.filesToDelete) {
      // Filter files that have openaiFileId
      const filesWithOpenaiId = result.data.filesToDelete.filter(file => file.openaiFileId);

      if (filesWithOpenaiId.length > 0) {
        // Delete OpenAI files concurrently
        const deletionPromises = filesWithOpenaiId.map(file =>
          deleteFile(file.openaiFileId!).catch((error: any) => {
            console.error(`Error deleting OpenAI file ${file.openaiFileId}:`, error);
            return { success: false, error };
          })
        );

        // Wait for all deletions to complete (success or failure)
        await Promise.allSettled(deletionPromises);
      }
    }

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error('Error in deleteKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to delete knowledge base',
    };
  }
};

// These functions are now handled by the file service
// and are re-exported here for convenience
const addFileToKnowledgeBaseService = async (
  knowledgeBaseId: number,
  fileId: number,
  currentUserId?: number
): Promise<KnowledgeBaseServiceResult<void>> => {
  try {
    const result = await addFileToKnowledgeBaseFromFileService(
      fileId,
      knowledgeBaseId,
      currentUserId
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error in addFileToKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to add file to knowledge base',
    };
  }
};

const removeFileFromKnowledgeBaseService = async (
  knowledgeBaseId: number,
  fileId: number,
  currentUserId?: number
): Promise<KnowledgeBaseServiceResult<void>> => {
  try {
    const result = await removeFileFromKnowledgeBaseFromFileService(
      fileId,
      knowledgeBaseId,
      currentUserId
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error in removeFileFromKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to remove file from knowledge base',
    };
  }
};

const getKnowledgeBaseFilesService = async (
  knowledgeBaseId: number
): Promise<KnowledgeBaseServiceResult<any[]>> => {
  try {
    const result = await getKnowledgeBaseFiles(knowledgeBaseId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in getKnowledgeBaseFilesService:', error);
    return {
      success: false,
      error: 'Failed to get knowledge base files',
    };
  }
};

export {
  addFileToKnowledgeBaseService,
  createKnowledgeBaseService,
  deleteKnowledgeBaseService,
  getKnowledgeBaseByIdPublicService,
  getKnowledgeBaseByIdService,
  getKnowledgeBaseFilesService,
  getUserKnowledgeBasesPublicService,
  getUserKnowledgeBasesService,
  removeFileFromKnowledgeBaseService,
  updateKnowledgeBaseService,
};
