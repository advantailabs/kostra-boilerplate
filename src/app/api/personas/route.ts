import { NextRequest } from 'next/server';

import { FREE_LIMITS } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { createPersonaService, getUserPersonasService } from '@/services/internal/persona';
import { createPersonaSchema } from '@/validations/persona';
import { UserPlan } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user's personas
    const result = await getUserPersonasService(authUser.userId);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      personas: result.data,
      message: 'Personas retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
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
    const validationResult = createPersonaSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { name, description, instructions, tags, logo } = validationResult.data;

    // Enforce Free plan limit: max 1 persona
    if (authUser.plan === UserPlan.FREE) {
      const personaCount = await prisma.persona.count({
        where: { userId: authUser.userId, deletedAt: null },
      });
      if (personaCount >= FREE_LIMITS.personas) {
        return errorResponse('Free plan limit reached: You can only create 1 persona.', 403);
      }
      // Also ensure KB limit isn't exceeded since persona creation creates a KB
      const kbCount = await prisma.knowledgeBase.count({
        where: { userId: authUser.userId, deletedAt: null },
      });
      if (kbCount >= FREE_LIMITS.knowledgeBases) {
        return errorResponse('Free plan limit reached: You can only have 1 knowledge base.', 403);
      }
    }

    // Create persona
    const result = await createPersonaService(authUser.userId, {
      userId: authUser.userId,
      name,
      description,
      instructions,
      tags,
      logo,
    });

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse(
      {
        persona: result.data,
        message: 'Persona created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating persona:', error);
    return internalServerErrorResponse();
  }
}
