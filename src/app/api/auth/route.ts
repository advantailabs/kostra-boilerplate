import { generateJWT, getAuthUser } from '@/lib/auth/jwt';
import { getUserByGoogleId } from '@/services/repositories/user';
import { NextRequest } from 'next/server';
// No direct NextResponse usage; use standardized responses
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    const user = await getUserByGoogleId(authUser.googleId);

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Ensure we only send serializable data
    const serializableUser = {
      id: authUser.userId,
      email: authUser.email,
      name: authUser.name,
      profilePicture: authUser.profilePicture,
      role: authUser.role,
      isOnboarded: authUser.isOnboarded,
      credits: authUser.credits,
      plan: authUser.plan,
      isOverdue: authUser.isOverdue,
      planExpiringAt: authUser.planExpiringAt,
    };

    // Generate a new token (refresh)
    const token = await generateJWT(authUser);

    return successResponse({
      user: serializableUser,
      token,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return internalServerErrorResponse();
  }
}
