import { getAuthUser } from '@/lib/auth/jwt';
import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { deleteUserById, getUserById, updateUserById } from '@/services/repositories/user';
import { updateUserSchema, userIdParamSchema } from '@/validations/admin';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((err: any) => ({
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((err: any) => ({
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

    const { name, email, role } = validationResult.data;

    const user = await getUserById(targetUserId);
    if (!user) {
      return notFoundResponse('User not found');
    }

    // Update user
    const updatedUser = await updateUserById(targetUserId, {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
    });

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(request);

    // Validate user ID parameter
    const paramValidation = userIdParamSchema.safeParse({ id: params.id });
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((err: any) => ({
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
