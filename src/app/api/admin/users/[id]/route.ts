import { getAuthUser } from '@/lib/auth/jwt';
import {
  badRequestResponse,
  formatZodError,
  hashPassword,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { deleteUserById, getUserById, updateUserById } from '@/services/repositories/user';
import { updateUserSchema, userIdParamSchema } from '@/validations/admin';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid parameter', errors);
    }

    const { id: targetUserId } = paramValidation.data;

    const user = await getUserById(targetUserId);
    if (!user) {
      return notFoundResponse('User not found');
    }

    const response = {
      user: {
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
      },
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    return internalServerErrorResponse();
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid parameter', errors);
    }

    const { id: targetUserId } = paramValidation.data;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const {
      name,
      email,
      role,
      isOnboarded,
      credits,
      stripeCustomerId,
      plan,
      isOverDue,
      planExpiringAt,
      password,
    } = validationResult.data;

    // Check if demo mode is enabled and role is being updated
    if (process.env.IS_DEMO) {
      return badRequestResponse('User cannot be updated in demo mode');
    }

    const user = await getUserById(targetUserId);
    if (!user) {
      return notFoundResponse('User not found');
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Add fields to updateData if defined
    Object.entries({
      name,
      email,
      role,
      isOnboarded,
      credits,
      stripeCustomerId,
      plan,
      isOverDue,
      planExpiringAt,
    }).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    // Handle password separately as it needs hashing
    if (password !== undefined) {
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await updateUserById(targetUserId, updateData);

    const response = {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        isOnboarded: updatedUser.isOnboarded,
        credits: updatedUser.credits,
        plan: updatedUser.plan,
        stripeCustomerId: updatedUser.stripeCustomerId,
        isOverDue: updatedUser.isOverDue,
        planExpiringAt: updatedUser.planExpiringAt?.toISOString(),
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error updating user:', error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const authUser = await getAuthUser(request);

    // Check if demo mode is enabled
    if (process.env.IS_DEMO === 'true') {
      return badRequestResponse('User deletion is disabled in demo mode');
    }

    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid parameter', errors);
    }

    const { id: targetUserId } = paramValidation.data;

    // Prevent admin from deleting themselves
    if (targetUserId === authUser?.userId) {
      return badRequestResponse('Cannot delete your own account');
    }

    const user = await getUserById(targetUserId);
    if (!user) {
      return notFoundResponse('User not found');
    }

    // Soft delete user
    await deleteUserById(targetUserId);

    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return internalServerErrorResponse();
  }
}
