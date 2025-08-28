// Using standardized response helpers
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { CreditService } from '@/services/internal/credit';
import { getUserById } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
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
