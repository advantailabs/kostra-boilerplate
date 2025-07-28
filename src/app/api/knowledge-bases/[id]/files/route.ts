import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {
  addFileToKnowledgeBaseService,
  getKnowledgeBaseFilesService,
  removeFileFromKnowledgeBaseService,
} from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { z } from 'zod';

const addFileSchema = z.object({
  fileId: z.number().positive('File ID must be a positive number'),
});

const removeFileSchema = z.object({
  fileId: z.number().positive('File ID must be a positive number'),
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

    // Get files for knowledge base
    const result = await getKnowledgeBaseFilesService(knowledgeBaseId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch files', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      files: result.data,
      message: 'Files retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge base files:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Knowledge base ID must be a number' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addFileSchema.safeParse(body);

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

    const { fileId } = validationResult.data;

    // Add file to knowledge base
    const result = await addFileToKnowledgeBaseService(knowledgeBaseId, fileId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to add file to knowledge base', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'File added to knowledge base successfully',
    });
  } catch (error) {
    console.error('Error adding file to knowledge base:', error);
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = removeFileSchema.safeParse(body);

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

    const { fileId } = validationResult.data;

    // Remove file from knowledge base
    const result = await removeFileFromKnowledgeBaseService(knowledgeBaseId, fileId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to remove file from knowledge base', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'File removed from knowledge base successfully',
    });
  } catch (error) {
    console.error('Error removing file from knowledge base:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
