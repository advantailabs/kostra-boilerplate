import {
  errorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import {
  addFileToKnowledgeBaseService,
  getKnowledgeBaseFilesService,
  removeFileFromKnowledgeBaseService,
} from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return errorResponse('Knowledge base ID must be a number', 400);
    }

    // Get files for knowledge base
    const result = await getKnowledgeBaseFilesService(knowledgeBaseId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      files: result.data,
      message: 'Files retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge base files:', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return errorResponse('Knowledge base ID must be a number', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addFileSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { fileId } = validationResult.data;

    // Add file to knowledge base
    const result = await addFileToKnowledgeBaseService(knowledgeBaseId, fileId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: 'File added to knowledge base successfully',
    });
  } catch (error) {
    console.error('Error adding file to knowledge base:', error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return errorResponse('Knowledge base ID must be a number', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = removeFileSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { fileId } = validationResult.data;

    // Remove file from knowledge base
    const result = await removeFileFromKnowledgeBaseService(knowledgeBaseId, fileId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: 'File removed from knowledge base successfully',
    });
  } catch (error) {
    console.error('Error removing file from knowledge base:', error);
    return internalServerErrorResponse();
  }
}
