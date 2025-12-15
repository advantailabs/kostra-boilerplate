import { getAuthUser } from '@/lib/auth/jwt';
import { internalServerErrorResponse, successResponse, unauthorizedResponse } from '@/lib/utils';
import { CreditService } from '@/services/internal/credit';
import { getUserById } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
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
