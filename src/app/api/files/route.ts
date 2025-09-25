import { FREE_LIMITS } from '@/data/config/plans';
import {
  errorResponse,
  formatZodError,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { getUserFilesService, uploadFileService } from '@/services/internal/files/file';
import { getFilesSchema, uploadFilesSchema } from '@/validations/files';
import { NextRequest } from 'next/server';

import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { getTotalFilesCount } from '@/services/repositories/file';
import { getUserById } from '@/services/repositories/user';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Polyfill for File in Node.js environment
if (typeof global.File === 'undefined') {
  const { Blob } = require('buffer');

  class FilePolyfill extends Blob {
    name: string;

    lastModified: number;

    webkitRelativePath: string = '';

    constructor(chunks: any[], filename: string, options: any = {}) {
      super(chunks, options);
      this.name = filename;
      this.lastModified = Date.now();
    }
  }

  (global as any).File = FilePolyfill;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);
    if (!user) {
      return unauthorizedResponse();
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validationResult = getFilesSchema.safeParse(queryParams);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid query parameters',
        formatZodError(validationResult.error)
      );
    }

    const { page, limit, search, sortBy, sortOrder, mimeType } = validationResult.data;

    // Get files
    const result = await getUserFilesService(user.id, page, limit, {
      search,
      sortBy,
      sortOrder,
      mimeType,
    });

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      ...result.data,
      message: 'Files retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);
    if (!user) {
      return unauthorizedResponse();
    }

    // Enforce Free plan total file limit for uploads
    if (user.plan === 'FREE') {
      const totalFiles = await getTotalFilesCount(user.id);
      if (!totalFiles.success) {
        return internalServerErrorResponse(totalFiles.error);
      }

      // Determine how many files are being uploaded in this request
      const bodyForCount = await request
        .clone()
        .json()
        .catch(() => null);
      const incomingCount = Array.isArray(bodyForCount?.files) ? bodyForCount.files.length : 1;
      if (totalFiles.data + incomingCount > FREE_LIMITS.filesTotal) {
        return errorResponse('Free plan limit reached: You can upload up to 50 total files.', 403);
      }
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = uploadFilesSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { files } = validationResult.data;

    // Process files in parallel using Promise.all
    const uploadPromises = files.map(async fileData => {
      // Create a mock File object for the service
      const mockFile = new File([], fileData.originalName, { type: fileData.mimeType });
      Object.defineProperty(mockFile, 'size', { value: fileData.size });

      // Upload file
      const result = await uploadFileService({
        userId: user.id,
        file: mockFile,
        s3Key: fileData.s3Key,
        uploadPurpose: fileData.uploadPurpose || 'UserDocument',
      });

      if (!result.success) {
        throw new Error(`Failed to upload file ${fileData.originalName}: ${result.error}`);
      }

      return result.data;
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);

      return successResponse(
        {
          files: uploadedFiles,
          message: `${uploadedFiles.length} file(s) uploaded successfully`,
        },
        201
      );
    } catch (error) {
      console.error('Error uploading files:', error);
      return internalServerErrorResponse(
        error instanceof Error ? error.message : 'Failed to upload files'
      );
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    return internalServerErrorResponse();
  }
}
