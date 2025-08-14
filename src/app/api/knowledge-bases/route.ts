import {
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
  createKnowledgeBaseService,
  getUserKnowledgeBasesPublicService,
} from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
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

export async function GET() {
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

    // Get user's knowledge bases
    const result = await getUserKnowledgeBasesPublicService(user.id);

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
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
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

    // Enforce credit threshold for creation
    if (user.credits < CREDIT_THRESHOLDS.creationMin) {
      return insufficientCreditsResponse();
    }

    // Create knowledge base
    const result = await createKnowledgeBaseService(user.id, {
      userId: user.id,
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
