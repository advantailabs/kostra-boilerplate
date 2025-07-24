import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getUserByClerkId } from '@/services/repositories/user';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const dbUser = await getUserByClerkId(user.id);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return standard settings
    const response = {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        profilePicture: dbUser.profilePicture,
        role: dbUser.role,
        isOnboarded: dbUser.isOnboarded,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_DATA]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
