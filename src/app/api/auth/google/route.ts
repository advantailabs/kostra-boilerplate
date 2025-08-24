import { getGoogleAuthUrl } from '@/services/external/google/auth';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || undefined;

    const authUrl = getGoogleAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
