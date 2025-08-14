import {
  errorResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { deleteFileService, getFileByIdService, updateFileService } from '@/services/internal/file';
import { getUserByClerkId } from '@/services/repositories/user';
import { updateFileSchema } from '@/validations/files';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return errorResponse('File ID must be a number', 400);
    }

    // Get file
    const result = await getFileByIdService(fileId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    if (!result.data) {
      return notFoundResponse('File not found');
    }

    // Check if user owns this file
    if (result.data.userId !== user.id) {
      return forbiddenResponse('Access denied');
    }

    return successResponse({
      file: result.data,
      message: 'File retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return internalServerErrorResponse();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return errorResponse('File ID must be a number', 400);
    }

    // Get file to check ownership
    const fileResult = await getFileByIdService(fileId);
    if (!fileResult.success) {
      return internalServerErrorResponse(fileResult.error);
    }

    if (!fileResult.data) {
      return notFoundResponse('File not found');
    }

    // Check if user owns this file
    if (fileResult.data.userId !== user.id) {
      return forbiddenResponse('Access denied');
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateFileSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    // Update file
    const result = await updateFileService(fileId, validationResult.data);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      file: result.data,
      message: 'File updated successfully',
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return errorResponse('File ID must be a number', 400);
    }

    // Check if user owns this file
    const fileResult = await getFileByIdService(fileId);
    if (!fileResult.success || !fileResult.data) {
      return notFoundResponse('File not found');
    }

    if (fileResult.data.userId !== user.id) {
      return forbiddenResponse('Access denied');
    }

    // Delete file
    const result = await deleteFileService(fileId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: `File moved to trash successfully`,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return internalServerErrorResponse();
  }
}
