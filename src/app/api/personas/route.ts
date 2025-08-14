import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import {
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { createPersonaService, getUserPersonasService } from '@/services/internal/persona';
import { getUserByClerkId } from '@/services/repositories/user';
import { createPersonaSchema } from '@/validations/persona';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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
    const validationResult = createPersonaSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    const { name, description, instructions, tags, logo } = validationResult.data;

    // Enforce credit threshold for creation
    if (user.credits < CREDIT_THRESHOLDS.creationMin) {
      return insufficientCreditsResponse();
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
