import { JWT_KEY } from '@/lib/auth/jwt';
import { internalServerErrorResponse, successResponse } from '@/lib/utils';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear the auth token cookie
    cookieStore.delete(JWT_KEY || 'auth-token');

    return successResponse({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return internalServerErrorResponse('Logout failed');
  }
}
