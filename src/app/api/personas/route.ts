import { NextRequest } from 'next/server';

import { FREE_LIMITS } from '@/data/config/plans';
import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { createPersonaService, getUserPersonasService } from '@/services/internal/persona';
import { getUserById } from '@/services/repositories/user';
import { createPersonaSchema } from '@/validations/persona';
import { UserPlan } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Get user's personas
    const result = await getUserPersonasService(user.id);

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
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createPersonaSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { name, description, instructions, tags, logo } = validationResult.data;

    // Enforce Free plan limit: max 1 persona
    if (user.plan === UserPlan.FREE) {
      const personaCount = await prisma.persona.count({
        where: { userId: user.id, deletedAt: null },
      });
      if (personaCount >= FREE_LIMITS.personas) {
        return errorResponse('Free plan limit reached: You can only create 1 persona.', 403);
      }
    }

    // Create persona
    const result = await createPersonaService(user.id, {
      userId: user.id,
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
