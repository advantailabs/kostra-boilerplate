import { generateDownloadUrl } from '@/lib/s3';
import {
  createFile as createOpenAIFile,
  deleteFile as deleteOpenAIFile,
} from '@/services/external/openai/files';
import {
  addFileToVectorStore,
  deleteFileFromVectorStore,
} from '@/services/external/openai/vector-store';
import {
  addFileToKnowledgeBase,
  createFile,
  CreateFileData,
  deleteFile,
  FileFilters,
  FileWithKnowledgeBases,
  findFileById,
  findFilesByUserId,
  removeFileFromKnowledgeBase,
  updateFile,
  UpdateFileData,
} from '@/services/repositories/file';
import { findKnowledgeBaseById } from '@/services/repositories/knowledge-base';

export interface FileServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadFileData {
  userId: number;
  file: File;
  s3Key: string;
  knowledgeBaseIds?: number[];
}

export interface FileListResult {
  files: FileWithKnowledgeBases[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Forward declarations of functions that are used before they are defined
const addFileToKnowledgeBaseService = async (
  fileId: number,
  knowledgeBaseId: number
): Promise<FileServiceResult<void>> => {
  try {
    // Get the file to check if it exists and get its OpenAI file ID
    const fileResult = await findFileById(fileId);

    if (!fileResult.success || !fileResult.data) {
      return {
        success: false,
        error: 'File not found',
      };
    }

    const file = fileResult.data;

    // Get the knowledge base to check if it exists and get its vector store ID
    const kbResult = await findKnowledgeBaseById(knowledgeBaseId);

    if (!kbResult.success || !kbResult.data) {
      return {
        success: false,
        error: 'Knowledge base not found',
      };
    }

    const knowledgeBase = kbResult.data;

    // Add file to knowledge base in database
    const dbResult = await addFileToKnowledgeBase(fileId, knowledgeBaseId);

    if (!dbResult.success) {
      return {
        success: false,
        error: dbResult.error,
      };
    }

    // Add file to vector store if both OpenAI file ID and vector store ID exist
    if (file.openaiFileId && knowledgeBase.vectorStoreId) {
      try {
        const vectorStoreResult = await addFileToVectorStore({
          vectorStoreId: knowledgeBase.vectorStoreId,
          fileId: file.openaiFileId,
        });

        if (!vectorStoreResult.success) {
          console.warn('Failed to add file to vector store:', vectorStoreResult.error);
          // Don't fail the operation if vector store addition fails, but log the warning
        }
      } catch (vectorStoreError) {
        console.warn('Failed to add file to vector store:', vectorStoreError);
        // Don't fail the operation if vector store addition fails
      }
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
  fileId: number,
  knowledgeBaseId: number
): Promise<FileServiceResult<void>> => {
  try {
    // Get the file to check if it exists and get its OpenAI file ID
    const fileResult = await findFileById(fileId);

    if (!fileResult.success || !fileResult.data) {
      return {
        success: false,
        error: 'File not found',
      };
    }

    const file = fileResult.data;

    // Get the knowledge base to check if it exists and get its vector store ID
    const kbResult = await findKnowledgeBaseById(knowledgeBaseId);

    if (!kbResult.success || !kbResult.data) {
      return {
        success: false,
        error: 'Knowledge base not found',
      };
    }

    const knowledgeBase = kbResult.data;

    // Remove file from knowledge base in database
    const dbResult = await removeFileFromKnowledgeBase(fileId, knowledgeBaseId);

    if (!dbResult.success) {
      return {
        success: false,
        error: dbResult.error,
      };
    }

    // Remove file from vector store if both OpenAI file ID and vector store ID exist
    if (file.openaiFileId && knowledgeBase.vectorStoreId) {
      try {
        const vectorStoreResult = await deleteFileFromVectorStore({
          vectorStoreId: knowledgeBase.vectorStoreId,
          fileId: file.openaiFileId,
        });

        if (!vectorStoreResult.success) {
          console.warn('Failed to delete file from vector store:', vectorStoreResult.error);
          // Don't fail the operation if vector store deletion fails, but log the warning
        }
      } catch (vectorStoreError) {
        console.warn('Failed to delete file from vector store:', vectorStoreError);
        // Don't fail the operation if vector store deletion fails
      }
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

const getUserFilesService = async (
  userId: number,
  page = 1,
  limit = 20,
  filters?: FileFilters
): Promise<FileServiceResult<FileListResult>> => {
  try {
    const result = await findFilesByUserId(userId, page, limit, filters);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    const totalPages = Math.ceil(result.data!.total / limit);

    return {
      success: true,
      data: {
        files: result.data!.files,
        total: result.data!.total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error in getUserFilesService:', error);
    return {
      success: false,
      error: 'Failed to fetch user files',
    };
  }
};

const uploadFileService = async (data: UploadFileData): Promise<FileServiceResult<any>> => {
  try {
    // Get presigned URL for file download from S3
    const downloadUrlResult = await generateDownloadUrl(
      process.env.R2_PRIVATE_BUCKET_NAME || 'peon-data-private',
      data.s3Key,
      data.file.name
    );

    console.log('downloadUrlResult', downloadUrlResult);

    // Create a readable stream from the presigned URL
    const response = await fetch(downloadUrlResult.downloadUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch file from S3');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a file-like object that OpenAI can use
    // In Node.js environment, we can create a File object from Buffer
    const openaiFile = new File([buffer], data.file.name, { type: data.file.type });

    // Upload file to OpenAI with 'assistants' purpose
    const openaiFileResult = await createOpenAIFile({
      file: openaiFile,
      purpose: 'assistants',
    });

    if (!openaiFileResult.success) {
      return {
        success: false,
        error: openaiFileResult.error,
      };
    }

    // Create file record in database
    const fileData: CreateFileData = {
      userId: data.userId,
      openaiFileId: openaiFileResult.data!.id,
      filename: data.s3Key,
      originalName: data.file.name,
      mimeType: data.file.type,
      size: data.file.size,
      url: data.s3Key, // Store S3 key as URL
      metadata: {
        uploadedAt: new Date().toISOString(),
        originalFile: data.file.name,
      },
    };

    const createResult = await createFile(fileData);

    if (!createResult.success) {
      // If database creation fails, delete the OpenAI file
      await deleteOpenAIFile(openaiFileResult.data!.id);
      return {
        success: false,
        error: createResult.error,
      };
    }

    // If knowledge bases are specified, add file to them
    if (data.knowledgeBaseIds && data.knowledgeBaseIds.length > 0) {
      const addToKbPromises = data.knowledgeBaseIds.map(async knowledgeBaseId => {
        const kbResult = await addFileToKnowledgeBaseService(
          createResult.data!.id,
          knowledgeBaseId
        );
        if (!kbResult.success) {
          console.warn('Failed to add file to knowledge base:', kbResult.error);
          // Don't fail the upload, just log the warning
        }
        return kbResult;
      });

      await Promise.all(addToKbPromises);
    }

    return {
      success: true,
      data: createResult.data,
    };
  } catch (error) {
    console.error('Error in uploadFileService:', error);
    return {
      success: false,
      error: 'Failed to upload file',
    };
  }
};

const getFileByIdService = async (
  id: number
): Promise<FileServiceResult<FileWithKnowledgeBases | null>> => {
  try {
    const result = await findFileById(id);

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
    console.error('Error in getFileByIdService:', error);
    return {
      success: false,
      error: 'Failed to fetch file',
    };
  }
};

const updateFileService = async (
  id: number,
  data: UpdateFileData
): Promise<FileServiceResult<any>> => {
  try {
    const result = await updateFile(id, data);

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
    console.error('Error in updateFileService:', error);
    return {
      success: false,
      error: 'Failed to update file',
    };
  }
};

const deleteFileService = async (id: number): Promise<FileServiceResult<void>> => {
  try {
    // First, get the file to check if it exists and get its OpenAI file ID
    const fileResult = await findFileById(id);

    if (!fileResult.success || !fileResult.data) {
      return {
        success: false,
        error: 'File not found',
      };
    }

    const file = fileResult.data;

    // Delete from OpenAI if we have an OpenAI file ID
    if (file.openaiFileId) {
      try {
        const deleteResult = await deleteOpenAIFile(file.openaiFileId);
        if (!deleteResult.success) {
          console.warn('Failed to delete OpenAI file:', deleteResult.error);
          // Don't fail the operation if OpenAI deletion fails
        }
      } catch (openaiError) {
        console.warn('Failed to delete OpenAI file:', openaiError);
        // Don't fail the operation if OpenAI deletion fails
      }
    }

    // Remove file from all associated knowledge bases and vector stores
    if (file.fileKnowledgeBases && file.fileKnowledgeBases.length > 0) {
      const removeFromKbPromises = file.fileKnowledgeBases.map(async fileKb => {
        const kbResult = await removeFileFromKnowledgeBaseService(id, fileKb.knowledgeBase.id);
        if (!kbResult.success) {
          console.warn('Failed to remove file from knowledge base:', kbResult.error);
          // Don't fail the operation if knowledge base removal fails
        }
        return kbResult;
      });

      await Promise.all(removeFromKbPromises);
    }

    // Soft delete from database
    const result = await deleteFile(id);

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
    console.error('Error in deleteFileService:', error);
    return {
      success: false,
      error: 'Failed to delete file',
    };
  }
};

export {
  addFileToKnowledgeBaseService,
  deleteFileService,
  getFileByIdService,
  getUserFilesService,
  removeFileFromKnowledgeBaseService,
  updateFileService,
  uploadFileService,
};
