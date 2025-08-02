import { getUserFilesService, uploadFileService } from '@/services/internal/file';
import { getUserByClerkId } from '@/services/repositories/user';
import { getFilesSchema, uploadFilesSchema } from '@/validations/files';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validationResult = getFilesSchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid query parameters',
          details: validationResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Failed to fetch files', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...result.data,
      message: 'Files retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
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
        return NextResponse.json(
          {
            error: 'Image files not supported',
            message:
              'Image files (JPG, PNG, SVG, WebP, etc.) cannot be uploaded to knowledge bases.',
            code: 'IMAGE_FILES_NOT_SUPPORTED',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid input data',
          details: validationResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
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
      });

      if (!result.success) {
        throw new Error(`Failed to upload file ${fileData.originalName}: ${result.error}`);
      }

      return result.data;
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);

      return NextResponse.json(
        {
          files: uploadedFiles,
          message: `${uploadedFiles.length} file(s) uploaded successfully`,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error uploading files:', error);
      return NextResponse.json(
        {
          error: 'Failed to upload files',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
