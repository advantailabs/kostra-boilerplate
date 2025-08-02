import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {
  createKnowledgeBaseService,
  getUserKnowledgeBasesPublicService,
} from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { z } from 'zod';

const createKnowledgeBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  metadata: z.any().optional(),
});

export async function GET() {
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

    // Get user's knowledge bases
    const result = await getUserKnowledgeBasesPublicService(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch knowledge bases', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      knowledgeBases: result.data,
      message: 'Knowledge bases retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
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
    const validationResult = createKnowledgeBaseSchema.safeParse(body);

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

    const { title, description, metadata } = validationResult.data;

    // Create knowledge base
    const result = await createKnowledgeBaseService(user.id, {
      userId: user.id,
      title,
      description,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create knowledge base', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        knowledgeBase: result.data,
        message: 'Knowledge base created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
