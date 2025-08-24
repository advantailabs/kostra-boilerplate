import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { getUserByGoogleId } from '@/services/repositories/user';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user data
    const dbUser = await getUserByGoogleId(authUser.googleId);

    if (!dbUser) {
      return notFoundResponse('User not found');
    }

    // Return standard settings
    const response = {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profilePicture: dbUser.profilePicture,
        role: dbUser.role,
        isOnboarded: dbUser.isOnboarded,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_DATA]', error);
    return internalServerErrorResponse();
  }
}
