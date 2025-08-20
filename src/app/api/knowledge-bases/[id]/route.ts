import {
  errorResponse,
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { CREDIT_THRESHOLDS } from '@/data/config/plans';
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

    // Get knowledge base with files
    const result = await getKnowledgeBaseByIdPublicService(knowledgeBaseId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    if (!result.data) {
      return notFoundResponse('Knowledge base not found');
    }

    // Check if user owns this knowledge base
    if (result.data.userId !== user.id) {
      return notFoundResponse('Knowledge base not found');
    }

    return successResponse({
      knowledgeBase: result.data,
      message: 'Knowledge base retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
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

    const knowledgeBaseId = parseInt(params.id, 10);
    if (Number.isNaN(knowledgeBaseId)) {
      return errorResponse('Knowledge base ID must be a number', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateKnowledgeBaseSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    // Enforce credit threshold for update
    if (user.credits < CREDIT_THRESHOLDS.creationMin) {
      return insufficientCreditsResponse();
    }

    // Ensure the knowledge base exists and belongs to the user
    const kbCheck = await getKnowledgeBaseByIdPublicService(knowledgeBaseId);
    if (!kbCheck.success) {
      return internalServerErrorResponse(kbCheck.error);
    }
    if (!kbCheck.data || kbCheck.data.userId !== user.id) {
      return notFoundResponse('Knowledge base not found');
    }

    // Update knowledge base
    const result = await updateKnowledgeBaseService(
      knowledgeBaseId,
      validationResult.data,
      user.id
    );

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      knowledgeBase: result.data,
      message: 'Knowledge base updated successfully',
    });
  } catch (error) {
    console.error('Error updating knowledge base:', error);
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

    // Get deleteFiles parameter from query string
    const { searchParams } = new URL(request.url);
    const deleteFiles = searchParams.get('deleteFiles') === 'true';

    // Ensure the knowledge base exists and belongs to the user
    const kbCheck = await getKnowledgeBaseByIdPublicService(knowledgeBaseId);
    if (!kbCheck.success) {
      return internalServerErrorResponse(kbCheck.error);
    }
    if (!kbCheck.data || kbCheck.data.userId !== user.id) {
      return notFoundResponse('Knowledge base not found');
    }

    // Delete knowledge base
    const result = await deleteKnowledgeBaseService(knowledgeBaseId, deleteFiles, user.id);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: 'Knowledge base deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
    return internalServerErrorResponse();
  }
}
