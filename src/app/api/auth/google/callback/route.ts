import { generateJWT } from '@/lib/auth/jwt';
import { getGoogleTokens, getGoogleUserInfo } from '@/services/external/google/auth';
import { upsertUser } from '@/services/repositories/user';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/error?message=No authorization code provided', request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getGoogleTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL('/auth/error?message=Failed to get access token', request.url)
      );
    }

    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // Create or update user in database
    const user = await upsertUser({
      googleId: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      profilePicture: googleUser.picture,
      isOnboarded: true,
    });

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

    // Set cookie and redirect
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Redirect to appropriate page
    // const redirectUrl = user.isOnboarded ? '/app/chat' : '/onboarding';
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?message=Authentication failed', request.url));
  }
}
