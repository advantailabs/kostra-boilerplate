import { UserPlan, UserRole } from '@/lib/prisma/generated/client';
import {
  errorResponse,
  formatZodError,
  hashPassword,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { createUser, getUsersWithFilters, UserFilterOptions } from '@/services/repositories/user';
import { createUserSchema } from '@/validations/admin';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filter parameters
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') as UserRole | null;
    const plan = searchParams.get('plan') as UserPlan | null;
    const isOnboardedParam = searchParams.get('isOnboarded');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const sortBy = (searchParams.get('sortBy') as UserFilterOptions['sortBy']) || 'id';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse pagination parameters
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Parse boolean parameters
    const isOnboarded =
      isOnboardedParam === 'true' ? true : isOnboardedParam === 'false' ? false : undefined;

    // Build filter options
    const filterOptions: UserFilterOptions = {
      search: search || undefined,
      role: role || undefined,
      plan: plan || undefined,
      isOnboarded,
      includeDeleted,
      sortBy,
      sortOrder,
      limit,
      offset,
    };

    // Get users with filters
    const { users, totalCount } = await getUsersWithFilters(filterOptions);

    const response = {
      users: users.map(user => ({
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
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      totalCount,
      pagination: limit
        ? {
            limit,
            offset,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Math.floor(offset / limit) + 1,
          }
        : undefined,
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

    if (error instanceof Error && error.message === 'Email already exists') {
      return errorResponse('Email already exists');
    }

    return internalServerErrorResponse();
  }
}
