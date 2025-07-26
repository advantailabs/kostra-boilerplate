import { generatePresignedUrl } from '@/lib/s3';
import { getUserByClerkId } from '@/services/repositories/user';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = getAuth(request);

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { fileType } = body;

    if (!fileType || typeof fileType !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'File type is required' },
        { status: 400 }
      );
    }

    // Only allow image file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type', message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const { presignedUrl, key } = await generatePresignedUrl(fileType);

    return NextResponse.json({
      presignedUrl,
      key,
      message: 'Pre-signed URL generated successfully',
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
