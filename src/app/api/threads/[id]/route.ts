import {
  errorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { deleteThreadService, getThreadWithMessages } from '@/services/internal/chat';
import { getUserByClerkId } from '@/services/repositories/user';

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

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return errorResponse('Thread ID must be a number', 400);
    }

    // Get thread with messages
    const result = await getThreadWithMessages(user.id, threadId);

    if (!result.success) {
      return result.error?.includes('not found')
        ? notFoundResponse('Thread not found')
        : internalServerErrorResponse(result.error);
    }

    return successResponse({
      thread: result.data,
      message: 'Thread retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
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

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return errorResponse('Thread ID must be a number', 400);
    }

    // Delete thread
    const result = await deleteThreadService(user.id, threadId);

    if (!result.success) {
      return result.error?.includes('not found')
        ? notFoundResponse('Thread not found')
        : internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: 'Thread deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return internalServerErrorResponse();
  }
}
