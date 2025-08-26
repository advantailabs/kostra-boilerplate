import { getAuthUser } from '@/lib/auth/jwt';
import { internalServerErrorResponse, unauthorizedResponse } from '@/lib/utils/response';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Return standard settings
    const response = {
      user: {
        id: authUser.userId,
        name: authUser.name,
        email: authUser.email,
        profilePicture: authUser.profilePicture,
        role: authUser.role,
        isOnboarded: authUser.isOnboarded,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_DATA]', error);
    return internalServerErrorResponse();
  }
}
