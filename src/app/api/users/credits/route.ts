// Using standardized response helpers
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

import { getAuthUser } from '@/lib/auth/jwt';
import { CreditService } from '@/services/internal/credit';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get current credits
    const credits = await CreditService.getUserCredits(authUser.userId);

    return successResponse({
      credits,
    });
  } catch (error) {
    console.error('Error getting user credits:', error);
    return internalServerErrorResponse();
  }
}
