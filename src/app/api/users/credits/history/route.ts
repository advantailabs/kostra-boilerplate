import { auth } from '@clerk/nextjs/server';

import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { CreditService } from '@/services/internal/credit';
import { getUserByClerkId } from '@/services/repositories/user';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200) : 50;

    const history = await CreditService.getCreditHistory(user.id, limit);

    return successResponse({ history });
  } catch (error) {
    console.error('Error getting credit history:', error);
    return internalServerErrorResponse();
  }
}
