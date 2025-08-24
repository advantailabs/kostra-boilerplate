import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();

    // Clear the auth token cookie
    cookieStore.delete('auth-token');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
