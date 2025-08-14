import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import {
  errorResponse,
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { getUserFilesService, uploadFileService } from '@/services/internal/file';
import { getUserByClerkId } from '@/services/repositories/user';
import { getFilesSchema, uploadFilesSchema } from '@/validations/files';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

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
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
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
    const result = await getUserFilesService(user.id, page, limit, {
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
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    // Enforce credit threshold for uploads
    if (user.credits < CREDIT_THRESHOLDS.creationMin) {
      return insufficientCreditsResponse();
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
