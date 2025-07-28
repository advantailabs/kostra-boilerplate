import {
  addFileToKnowledgeBase,
  createKnowledgeBase,
  deleteKnowledgeBase,
  findKnowledgeBaseById,
  findKnowledgeBasesByUserId,
  getKnowledgeBaseFiles,
  removeFileFromKnowledgeBase,
  updateKnowledgeBase,
} from '@/services/repositories/knowledge-base';
import {
  CreateKnowledgeBaseData,
  KnowledgeBaseWithFiles,
  UpdateKnowledgeBaseData,
} from '@/types/chat';

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
    const result = await createKnowledgeBase(data);

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

const updateKnowledgeBaseService = async (
  id: number,
  data: UpdateKnowledgeBaseData
): Promise<KnowledgeBaseServiceResult<any>> => {
  try {
    const result = await updateKnowledgeBase(id, data);

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
  id: number
): Promise<KnowledgeBaseServiceResult<boolean>> => {
  try {
    const result = await deleteKnowledgeBase(id);

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
    console.error('Error in deleteKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to delete knowledge base',
    };
  }
};

const addFileToKnowledgeBaseService = async (
  knowledgeBaseId: number,
  fileId: number
): Promise<KnowledgeBaseServiceResult<any>> => {
  try {
    const result = await addFileToKnowledgeBase(knowledgeBaseId, fileId);

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
    console.error('Error in addFileToKnowledgeBaseService:', error);
    return {
      success: false,
      error: 'Failed to add file to knowledge base',
    };
  }
};

const removeFileFromKnowledgeBaseService = async (
  knowledgeBaseId: number,
  fileId: number
): Promise<KnowledgeBaseServiceResult<boolean>> => {
  try {
    const result = await removeFileFromKnowledgeBase(knowledgeBaseId, fileId);

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
  getKnowledgeBaseByIdService,
  getKnowledgeBaseFilesService,
  getUserKnowledgeBasesService,
  removeFileFromKnowledgeBaseService,
  updateKnowledgeBaseService,
};
