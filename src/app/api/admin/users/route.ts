import {
  badRequestResponse,
  formatZodError,
  hashPassword,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { createUser, getUserByEmail, getUserByRole } from '@/services/repositories/user';
import { createUserSchema } from '@/validations/admin';
import { UserRole } from '@prisma/client';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Get all users (excluding soft deleted)
    const users = await getUserByRole(UserRole.USER, true);

    // Filter users based on search term
    const filteredUsers = search
      ? users.filter(
          user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      : users;

    const response = {
      users: filteredUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isOnboarded: user.isOnboarded,
        credits: user.credits,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
        isOverDue: user.isOverDue,
        planExpiringAt: user.planExpiringAt?.toISOString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error getting users', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { email, password, role: dbRole } = validationResult.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return badRequestResponse('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await createUser({
      email,
      name: email.split('@')[0], // Use email prefix as name
      googleId: undefined, // Will be set when user signs in
      password: hashedPassword,
      role: dbRole,
      isOnboarded: true, // Admin-created users are considered onboarded
    });

    const response = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        role: newUser.role,
        isOnboarded: newUser.isOnboarded,
        credits: newUser.credits,
        plan: newUser.plan,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    };

    return successResponse(response, 201);
  } catch (error) {
    console.error('Error creating user', error);
    return internalServerErrorResponse();
  }
}
