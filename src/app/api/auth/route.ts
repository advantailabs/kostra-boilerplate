import { getUserByClerkId } from '@/services/repositories/user';
import { auth } from '@clerk/nextjs/server';
import { SignJWT } from 'jose';
// No direct NextResponse usage; use standardized responses
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const revalidate = 0;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.userId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(session.userId);

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Ensure we only send serializable data
    const serializableUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      role: user.role,
      isOnboarded: user.isOnboarded,
      credits: user.credits,
      plan: user.plan,
      isOverdue: user.isOverDue,
      planExpiringAt: user.planExpiringAt ? user.planExpiringAt.toISOString() : null,
      // Add any other serializable properties you need
    };

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      isOnboarded: user.isOnboarded,
      credits: user.credits,
      plan: user.plan,
      isOverdue: user.isOverDue,
      planExpiringAt: user.planExpiringAt ? user.planExpiringAt.toISOString() : null,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    return successResponse({
      user: serializableUser,
      token,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return internalServerErrorResponse();
  }
}
