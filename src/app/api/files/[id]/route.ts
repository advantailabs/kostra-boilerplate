import { deleteFileService, getFileByIdService, updateFileService } from '@/services/internal/file';
import { getUserByClerkId } from '@/services/repositories/user';
import { updateFileSchema } from '@/validations/files';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'File ID must be a number' },
        { status: 400 }
      );
    }

    // Get file
    const result = await getFileByIdService(fileId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch file', message: result.error },
        { status: 500 }
      );
    }

    if (!result.data) {
      return NextResponse.json({ error: 'Not found', message: 'File not found' }, { status: 404 });
    }

    // Check if user owns this file
    if (result.data.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden', message: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      file: result.data,
      message: 'File retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'File ID must be a number' },
        { status: 400 }
      );
    }

    // Get file to check ownership
    const fileResult = await getFileByIdService(fileId);
    if (!fileResult.success) {
      return NextResponse.json(
        { error: 'Failed to fetch file', message: fileResult.error },
        { status: 500 }
      );
    }

    if (!fileResult.data) {
      return NextResponse.json({ error: 'Not found', message: 'File not found' }, { status: 404 });
    }

    // Check if user owns this file
    if (fileResult.data.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden', message: 'Access denied' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateFileSchema.safeParse(body);

    if (!validationResult.success) {
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

    // Update file
    const result = await updateFileService(fileId, validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to update file', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      file: result.data,
      message: 'File updated successfully',
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
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

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'File ID must be a number' },
        { status: 400 }
      );
    }

    // Check if user owns this file
    const fileResult = await getFileByIdService(fileId);
    if (!fileResult.success || !fileResult.data) {
      return NextResponse.json({ error: 'Not found', message: 'File not found' }, { status: 404 });
    }

    if (fileResult.data.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden', message: 'Access denied' }, { status: 403 });
    }

    // Delete file
    const result = await deleteFileService(fileId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to delete file', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `File moved to trash successfully`,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
