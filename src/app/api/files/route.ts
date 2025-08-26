import { FREE_LIMITS } from '@/data/config/plans';
import { prisma } from '@/lib/prisma';
import {
  errorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { getUserFilesService, uploadFileService } from '@/services/internal/file';
import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';
import { getFilesSchema, uploadFilesSchema } from '@/validations/files';
import { NextRequest } from 'next/server';

import { getAuthUser } from '@/lib/auth/jwt';

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
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return unauthorizedResponse();
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validationResult = getFilesSchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid query parameters', errors);
    }

    const { page, limit, search, sortBy, sortOrder, knowledgeBaseId, personaId, mimeType } =
      validationResult.data;

    // Get files
    const result = await getUserFilesService(authUser.userId, page, limit, {
      search,
      sortBy,
      sortOrder,
      knowledgeBaseId,
      personaId,
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
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return unauthorizedResponse();
    }

    // Enforce Free plan total file limit for uploads (user files + KB files)
    if (authUser.plan === 'FREE') {
      const totalFiles = await prisma.file.count({
        where: { userId: authUser.userId, deletedAt: null },
      });
      // Determine how many files are being uploaded in this request
      const bodyForCount = await request
        .clone()
        .json()
        .catch(() => null);
      const incomingCount = Array.isArray(bodyForCount?.files) ? bodyForCount.files.length : 1;
      if (totalFiles + incomingCount > FREE_LIMITS.filesTotal) {
        return errorResponse('Free plan limit reached: You can upload up to 50 total files.', 403);
      }
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = uploadFilesSchema.safeParse(body);

    if (!validationResult.success) {
      // Check if this is an image file validation error
      const imageValidationError = validationResult.error.issues.find(
        (err: any) => err.path.includes('files') && err.message.includes('Image files')
      );

      if (imageValidationError) {
        return errorResponse(
          'Image files (JPG, PNG, SVG, WebP, etc.) cannot be uploaded to knowledge bases.',
          400
        );
      }

      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { files, knowledgeBaseIds } = validationResult.data;

    // If KB IDs are provided, ensure all belong to current user
    if (knowledgeBaseIds && knowledgeBaseIds.length > 0) {
      const ownershipChecks = await Promise.all(
        knowledgeBaseIds.map(async id => {
          const kb = await getKnowledgeBaseByIdPublicService(id);
          return kb.success && kb.data && kb.data.userId === authUser.userId;
        })
      );
      if (!ownershipChecks.every(Boolean)) {
        return notFoundResponse('Knowledge base not found');
      }
    }

    // Process files in parallel using Promise.all
    const uploadPromises = files.map(async fileData => {
      // Create a mock File object for the service
      const mockFile = new File([], fileData.originalName, { type: fileData.mimeType });
      Object.defineProperty(mockFile, 'size', { value: fileData.size });

      // Upload file
      const result = await uploadFileService({
        userId: authUser.userId,
        file: mockFile,
        s3Key: fileData.s3Key,
        knowledgeBaseIds,
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
