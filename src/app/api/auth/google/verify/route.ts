import { generateJWT, setAuthCookie } from '@/lib/auth/jwt';
import { badRequestResponse, internalServerErrorResponse, successResponse } from '@/lib/utils';
import {
  extractGoogleUserInfo,
  validateGoogleResponse,
  verifyGoogleToken,
} from '@/services/external/google/auth';
import {
  createUser,
  getUserByGoogleIdOrEmail,
  updateUserGoogleId,
} from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return badRequestResponse('No credential provided');
    }

    let userInfo;
    try {
      userInfo = await verifyGoogleToken(credential);
    } catch (error) {
      console.error(error);
      return badRequestResponse('Invalid Google access token');
    }

    if (!validateGoogleResponse(userInfo)) {
      return badRequestResponse('Invalid user info from Google');
    }

    // Extract user info
    const googleUser = extractGoogleUserInfo(userInfo);

    // Find existing user by googleId or email
    let user = await getUserByGoogleIdOrEmail(googleUser.id as string, googleUser.email);

    // If user doesn't exist, create a new user
    if (!user) {
      user = await createUser({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        profilePicture: googleUser.picture,
      });
    } else if (!user.googleId) {
      user = await updateUserGoogleId(user.id, googleUser.id as string);
    }

    // Generate JWT token
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      profilePicture: user.profilePicture || undefined,
      isOnboarded: user.isOnboarded,
      credits: user.credits,
      plan: user.plan,
      isOverdue: user.isOverDue,
      planExpiringAt: user.planExpiringAt?.toISOString(),
      googleId: user.googleId || '', // Ensure googleId is always a string
    };

    const token = await generateJWT(jwtPayload);

    // Set the token in an HTTP-only cookie
    await setAuthCookie(token);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
        isOnboarded: user.isOnboarded,
        credits: user.credits,
        plan: user.plan,
        isOverdue: user.isOverDue,
        planExpiringAt: user.planExpiringAt?.toISOString(),
      },
      token,
    });
  } catch (error) {
    console.error('Google OAuth verification error:', error);
    return internalServerErrorResponse('Authentication failed');
  }
}
