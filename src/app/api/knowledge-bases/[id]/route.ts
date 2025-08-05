import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {
  deleteKnowledgeBaseService,
  getKnowledgeBaseByIdPublicService,
  updateKnowledgeBaseService,
} from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const updateKnowledgeBaseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  metadata: z.any().optional(),
});

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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Knowledge base ID must be a number' },
        { status: 400 }
      );
    }

    // Get knowledge base with files
    const result = await getKnowledgeBaseByIdPublicService(knowledgeBaseId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch knowledge base', message: result.error },
        { status: 500 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: 'Not found', message: 'Knowledge base not found' },
        { status: 404 }
      );
    }

    // Check if user owns this knowledge base
    if (result.data.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden', message: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      knowledgeBase: result.data,
      message: 'Knowledge base retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Knowledge base ID must be a number' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateKnowledgeBaseSchema.safeParse(body);

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

    // Update knowledge base
    const result = await updateKnowledgeBaseService(knowledgeBaseId, validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to update knowledge base', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      knowledgeBase: result.data,
      message: 'Knowledge base updated successfully',
    });
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Knowledge base ID must be a number' },
        { status: 400 }
      );
    }

    // Get deleteFiles parameter from query string
    const { searchParams } = new URL(request.url);
    const deleteFiles = searchParams.get('deleteFiles') === 'true';

    // Delete knowledge base
    const result = await deleteKnowledgeBaseService(knowledgeBaseId, deleteFiles);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to delete knowledge base', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Knowledge base deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
