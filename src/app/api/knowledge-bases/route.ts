import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { NextRequest } from 'next/server';

import { FREE_LIMITS } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import {
  createKnowledgeBaseService,
  getUserKnowledgeBasesPublicService,
} from '@/services/internal/knowledge-base';
import { UserPlan } from '@prisma/client';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const createKnowledgeBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  metadata: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user's knowledge bases
    const result = await getUserKnowledgeBasesPublicService(authUser.userId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      knowledgeBases: result.data,
      message: 'Knowledge bases retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createKnowledgeBaseSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { title, description, metadata } = validationResult.data;

    // Enforce Free plan limit: max 1 knowledge base
    if (authUser.plan === UserPlan.FREE) {
      const kbCount = await prisma.knowledgeBase.count({
        where: { userId: authUser.userId, deletedAt: null },
      });
      if (kbCount >= FREE_LIMITS.knowledgeBases) {
        return errorResponse('Free plan limit reached: You can only create 1 knowledge base.', 403);
      }
    }

    // Create knowledge base
    const result = await createKnowledgeBaseService(authUser.userId, {
      userId: authUser.userId,
      title,
      description,
      metadata,
    });

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse(
      {
        knowledgeBase: result.data,
        message: 'Knowledge base created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    return internalServerErrorResponse();
  }
}
