import { auth } from '@clerk/nextjs/server';
// Using standardized response helpers
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

import { CreditService } from '@/services/internal/credit';
import { getUserByClerkId } from '@/services/repositories/user';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
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
