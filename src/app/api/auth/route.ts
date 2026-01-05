import { generateJWT, getAuthUser, JWTPayload } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';
// No direct NextResponse usage; use standardized responses
import { internalServerErrorResponse, successResponse, unauthorizedResponse } from '@/lib/utils';
import { getUserById } from '@/services/repositories/user';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Ensure we only send serializable data
    const serializableUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      role: user.role,
      isOnboarded: user.isOnboarded,
      credits: user.credits,
      plan: user.plan,
      isOverdue: user.isOverDue,
      planExpiringAt: user.planExpiringAt,
    };

    // Generate a new token (refresh)
    const token = await generateJWT(user as unknown as JWTPayload);

    return successResponse({
      user: serializableUser,
      token,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return internalServerErrorResponse();
  }
}
