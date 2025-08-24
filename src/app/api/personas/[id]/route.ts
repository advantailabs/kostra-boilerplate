import {
  errorResponse,
  forbiddenResponse,
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { NextRequest } from 'next/server';

import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
import {
  deactivatePersonaService,
  getPersonaByIdService,
  updatePersonaService,
} from '@/services/internal/persona';
import { getUserByGoogleId } from '@/services/repositories/user';
import { updatePersonaSchema } from '@/validations/persona';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByGoogleId(authUser.googleId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return errorResponse('Persona ID must be a number', 400);
    }

    // Get persona
    const result = await getPersonaByIdService(personaId);

    if (!result.success) {
      return result.error?.includes('not found')
        ? notFoundResponse('Persona not found')
        : internalServerErrorResponse(result.error);
    }

    // Check if persona belongs to user
    if (result.data?.userId !== user.id) {
      return forbiddenResponse('You do not have access to this persona');
    }

    return successResponse({
      data: result.data,
      message: 'Persona retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    return internalServerErrorResponse();
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByGoogleId(authUser.googleId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return errorResponse('Persona ID must be a number', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updatePersonaSchema.safeParse(body);

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

    // Update persona
    const result = await updatePersonaService(user.id, personaId, validationResult.data);

    if (!result.success) {
      return result.error?.includes('not found')
        ? notFoundResponse('Persona not found')
        : internalServerErrorResponse(result.error);
    }

    return successResponse({
      data: result.data,
      message: 'Persona updated successfully',
    });
  } catch (error) {
    console.error('Error updating persona:', error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByGoogleId(authUser.googleId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return errorResponse('Persona ID must be a number', 400);
    }

    // Deactivate persona
    const result = await deactivatePersonaService(user.id, personaId);

    if (!result.success) {
      return result.error?.includes('not found')
        ? notFoundResponse('Persona not found')
        : internalServerErrorResponse(result.error);
    }

    return successResponse({
      message: 'Persona deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating persona:', error);
    return internalServerErrorResponse();
  }
}
