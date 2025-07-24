import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { deleteThreadService, getThreadWithMessages } from '@/services/internal/chat';
import { getUserByClerkId } from '@/services/repositories/user';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
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

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return NextResponse.json(
        { error: 'Invalid thread ID', message: 'Thread ID must be a number' },
        { status: 400 }
      );
    }

    // Get thread with messages
    const result = await getThreadWithMessages(user.id, threadId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch thread', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({
      data: result.data,
      message: 'Thread retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    const threadId = parseInt(params.id, 10);
    if (Number.isNaN(threadId)) {
      return NextResponse.json(
        { error: 'Invalid thread ID', message: 'Thread ID must be a number' },
        { status: 400 }
      );
    }

    // Delete thread
    const result = await deleteThreadService(user.id, threadId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to delete thread', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({
      message: 'Thread deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
