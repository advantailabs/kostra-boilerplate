import type { File } from '@/lib/prisma/generated/client';
import { inferUploadPurposeFromKey } from '@/services/internal/files/file-upload/file-utils';

import {
  createFile,
  CreateFileData,
  deleteFile,
  FileFilters,
  findFileById,
  findFileByIdInternal,
  findFilesByUserId,
  updateFile,
  UpdateFileData,
} from '@/services/repositories/file';
import type { File as FileType } from '@/types/file';

import { UploadPurpose } from '@/types/file-upload';

// Polyfill for File in Node.js environment
if (typeof global.File === 'undefined') {
  const { Blob } = await import('buffer');

  class FilePolyfill extends Blob {
    name: string;

    lastModified: number;

    webkitRelativePath: string = '';

    constructor(chunks: ArrayBuffer[], filename: string, options: BlobPropertyBag = {}) {
      super(chunks, options);
      this.name = filename;
      this.lastModified = Date.now();
    }
  }

  global.File = FilePolyfill as unknown as typeof File;
}

export interface FileServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadFileData {
  userId: number;
  file: { name: string; type: string; size: number };
  s3Key: string;
  uploadPurpose?: UploadPurpose;
}

export interface FileListResult {
  files: FileType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

const uploadFileService = async (data: UploadFileData): Promise<FileServiceResult<File>> => {
  try {
    // Create file record in database
    const fileData: CreateFileData = {
      userId: data.userId,
      filename: data.s3Key,
      originalName: data.file.name,
      mimeType: data.file.type,
      size: data.file.size,
      url: data.s3Key, // Store S3 key as URL
      metadata: {
        uploadedAt: new Date().toISOString(),
        originalFile: data.file.name,
        uploadPurpose: data.uploadPurpose || inferUploadPurposeFromKey(data.s3Key),
      },
    };

    const createResult = await createFile(fileData);

    if (!createResult.success) {
      return {
        success: false,
        error: createResult.error,
      };
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

const getFileByIdService = async (id: number): Promise<FileServiceResult<FileType | null>> => {
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
): Promise<FileServiceResult<File>> => {
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
    // Check if file exists
    const fileResult = await findFileByIdInternal(id);

    if (!fileResult.success || !fileResult.data) {
      return {
        success: false,
        error: 'File not found',
      };
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
  deleteFileService,
  getFileByIdService,
  getUserFilesService,
  updateFileService,
  uploadFileService,
};
