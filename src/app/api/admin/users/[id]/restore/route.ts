import {
  formatZodError,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { restoreUserById } from '@/services/repositories/user';
import { userIdParamSchema } from '@/validations/admin';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const validation = userIdParamSchema.safeParse({ id: params.id });
    if (!validation.success) {
      return validationErrorResponse('Validation failed', formatZodError(validation.error));
    }

    const { id } = validation.data;
    const restored = await restoreUserById(id);

    return successResponse({
      user: {
        id: restored.id,
        name: restored.name,
        email: restored.email,
        profilePicture: restored.profilePicture,
        role: restored.role,
        isOnboarded: restored.isOnboarded,
        credits: restored.credits,
        plan: restored.plan,
        createdAt: restored.createdAt,
        updatedAt: restored.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error restoring user', error);
    return internalServerErrorResponse();
  }
}
