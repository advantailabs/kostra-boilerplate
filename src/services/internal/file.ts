import {
  addFileToKnowledgeBase,
  createFile,
  CreateFileData,
  deleteFile,
  FileFilters,
  FileWithKnowledgeBases,
  findFileById,
  findFilesByUserId,
  permanentlyDeleteFile,
  removeFileFromKnowledgeBase,
  updateFile,
  UpdateFileData,
} from '@/services/repositories/file';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const getUserFilesService = async (
  userId: number,
  page: number = 1,
  limit: number = 20,
  filters?: FileFilters,
  prisma?: PrismaClient
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

const uploadFileService = async (
  data: UploadFileData,
  prisma?: PrismaClient
): Promise<FileServiceResult<any>> => {
  try {
    // Upload file to OpenAI with 'assistants' purpose
    // const openaiFile = await openai.files.create({
    //   file: data.file,
    //   purpose: 'assistants',
    // });

    // Create file record in database
    const fileData: CreateFileData = {
      userId: data.userId,
      openaiFileId: 'asd',
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

    // if (!createResult.success) {
    //   // If database creation fails, delete the OpenAI file
    //   await openai.files.delete(openaiFile.id);
    //   return {
    //     success: false,
    //     error: createResult.error,
    //   };
    // }

    // If knowledge bases are specified, add file to them
    if (data.knowledgeBaseIds && data.knowledgeBaseIds.length > 0) {
      for (const knowledgeBaseId of data.knowledgeBaseIds) {
        const kbResult = await addFileToKnowledgeBase(createResult.data!.id, knowledgeBaseId);

        if (!kbResult.success) {
          console.warn('Failed to add file to knowledge base:', kbResult.error);
          // Don't fail the upload, just log the warning
        }
      }
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
  id: number,
  prisma?: PrismaClient
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
  data: UpdateFileData,
  prisma?: PrismaClient
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

const deleteFileService = async (
  id: number,
  prisma?: PrismaClient
): Promise<FileServiceResult<void>> => {
  try {
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

const permanentlyDeleteFileService = async (
  id: number,
  prisma?: PrismaClient
): Promise<FileServiceResult<void>> => {
  try {
    // Get file to get OpenAI file ID
    const fileResult = await findFileById(id);
    if (!fileResult.success || !fileResult.data) {
      return {
        success: false,
        error: 'File not found',
      };
    }

    const file = fileResult.data;

    // Delete from OpenAI if it has an OpenAI file ID
    if (file.openaiFileId) {
      try {
        await openai.files.delete(file.openaiFileId);
      } catch (error) {
        console.warn('Failed to delete OpenAI file:', error);
        // Continue with deletion even if OpenAI deletion fails
      }
    }

    // Delete from database
    const result = await permanentlyDeleteFile(id);

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
    console.error('Error in permanentlyDeleteFileService:', error);
    return {
      success: false,
      error: 'Failed to permanently delete file',
    };
  }
};

const addFileToKnowledgeBaseService = async (
  fileId: number,
  knowledgeBaseId: number,
  prisma?: PrismaClient
): Promise<FileServiceResult<void>> => {
  try {
    const result = await addFileToKnowledgeBase(fileId, knowledgeBaseId);

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
  fileId: number,
  knowledgeBaseId: number,
  prisma?: PrismaClient
): Promise<FileServiceResult<void>> => {
  try {
    const result = await removeFileFromKnowledgeBase(fileId, knowledgeBaseId);

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

export {
  addFileToKnowledgeBaseService,
  deleteFileService,
  getFileByIdService,
  getUserFilesService,
  permanentlyDeleteFileService,
  removeFileFromKnowledgeBaseService,
  updateFileService,
  uploadFileService,
};
