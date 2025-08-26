import { generateJWT } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import {
  extractGoogleUserInfo,
  validateGoogleResponse,
  verifyGoogleToken,
} from '@/services/external/google/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'No credential provided' }, { status: 400 });
    }

    let userInfo;
    try {
      userInfo = await verifyGoogleToken(credential);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid Google access token' }, { status: 400 });
    }

    if (!validateGoogleResponse(userInfo)) {
      return NextResponse.json({ error: 'Invalid user info from Google' }, { status: 400 });
    }

    // Extract user info
    const googleUser = extractGoogleUserInfo(userInfo);

    // Find existing user by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.id }, { email: googleUser.email }],
      },
    });

    // If user doesn't exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          profilePicture: googleUser.picture,
          role: 'USER',
          isOnboarded: false,
          credits: 100,
          plan: 'FREE',
          isOverDue: false,
        },
      });
    } else if (!user.googleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id },
      });
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
      googleId: user.googleId,
    };

    const token = await generateJWT(jwtPayload);

    // Set the token in an HTTP-only cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json({
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
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
