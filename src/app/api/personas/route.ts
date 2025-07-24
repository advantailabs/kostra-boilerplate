import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { createPersonaService, getUserPersonasService } from '@/services/internal/persona';
import { getUserByClerkId } from '@/services/repositories/user';
import { createPersonaSchema } from '@/validations/persona';

export async function GET() {
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

    // Get user's personas
    const result = await getUserPersonasService(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch personas', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      personas: result.data,
      message: 'Personas retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createPersonaSchema.safeParse(body);

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

    const { name, description, instructions, tags } = validationResult.data;

    // Create persona
    const result = await createPersonaService(user.id, {
      userId: user.id,
      name,
      description,
      instructions,
      tags,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create persona', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        persona: result.data,
        message: 'Persona created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating persona:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
