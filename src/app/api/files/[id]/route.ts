import { getAuthUser } from '@/lib/auth/jwt';
import {
  errorResponse,
  formatZodError,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import {
  deleteFileService,
  getFileByIdService,
  updateFileService,
} from '@/services/internal/files/file';
import { getUserById } from '@/services/repositories/user';
import { updateFileSchema } from '@/validations/files';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
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
      return notFoundResponse('File not found');
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

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
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
      return notFoundResponse('File not found');
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateFileSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
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

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);
    if (!user) {
      return unauthorizedResponse();
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
      return notFoundResponse('File not found');
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
