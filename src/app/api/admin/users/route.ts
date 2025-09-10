import { getAuthUser } from '@/lib/auth/jwt';
import { hashPassword, validatePassword } from '@/lib/utils/password';
import { internalServerErrorResponse, unauthorizedResponse } from '@/lib/utils/response';
import { createUser, getUserByEmail, getUserByRole } from '@/services/repositories/user';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser || authUser.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    // Get all users (excluding soft deleted)
    const users = await getUserByRole(UserRole.USER, true);

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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting users', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser || authUser.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid password',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Map role to database role
    const dbRole = role === 'admin' ? UserRole.ADMIN : UserRole.USER;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating user', error);
    return internalServerErrorResponse();
  }
}
