// Using standardized response helpers
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

import { getAuthUser } from '@/lib/auth/jwt';
import { CreditService } from '@/services/internal/credit';
import { getUserByGoogleId } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByGoogleId(authUser.googleId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    // Get current credits
    const credits = await CreditService.getUserCredits(user.id);

    return successResponse({
      credits,
    });
  } catch (error) {
    console.error('Error getting user credits:', error);
    return internalServerErrorResponse();
  }
}
