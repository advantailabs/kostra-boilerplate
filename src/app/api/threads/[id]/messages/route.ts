import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { addMessageToThread } from '@/services/internal/chat';
import { getUserByClerkId } from '@/services/repositories/user';
import { addMessageSchema } from '@/validations/chat';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addMessageSchema.safeParse(body);

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

    const { content } = validationResult.data;

    // Add message to thread
    const result = await addMessageToThread(user.id, threadId, content);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to add message', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json(
      {
        thread: result.data,
        message: 'Message added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
