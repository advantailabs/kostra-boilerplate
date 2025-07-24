import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {
  deactivatePersonaService,
  getPersonaByIdService,
  updatePersonaService,
} from '@/services/internal/persona';
import { getUserByClerkId } from '@/services/repositories/user';
import { updatePersonaSchema } from '@/validations/persona';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
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

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return NextResponse.json(
        { error: 'Invalid persona ID', message: 'Persona ID must be a number' },
        { status: 400 }
      );
    }

    // Get persona
    const result = await getPersonaByIdService(personaId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch persona', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    // Check if persona belongs to user
    if (result.data?.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied', message: 'You do not have access to this persona' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data: result.data,
      message: 'Persona retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return NextResponse.json(
        { error: 'Invalid persona ID', message: 'Persona ID must be a number' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updatePersonaSchema.safeParse(body);

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

    // Update persona
    const result = await updatePersonaService(user.id, personaId, validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to update persona', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({
      data: result.data,
      message: 'Persona updated successfully',
    });
  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    const personaId = parseInt(params.id, 10);
    if (Number.isNaN(personaId)) {
      return NextResponse.json(
        { error: 'Invalid persona ID', message: 'Persona ID must be a number' },
        { status: 400 }
      );
    }

    // Deactivate persona
    const result = await deactivatePersonaService(user.id, personaId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to deactivate persona', message: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({
      message: 'Persona deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating persona:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
