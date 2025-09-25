import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { internalServerErrorResponse, unauthorizedResponse } from '@/lib/utils/response/response';
import { getUserById } from '@/services/repositories/user';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Return standard settings
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isOnboarded: user.isOnboarded,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_DATA]', error);
    return internalServerErrorResponse();
  }
}
