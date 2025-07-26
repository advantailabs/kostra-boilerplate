import { validateFileUpload } from '@/lib/file-upload-config';
import { generatePresignedUrl } from '@/lib/s3';
import { getUserByClerkId } from '@/services/repositories/user';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';
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

    const body: FileUploadRequest = await request.json();
    const { uploadPurpose, fileType, objectName, objectId } = body;

    // Validate required fields
    if (!uploadPurpose || !fileType || !objectName || objectId === undefined) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'uploadPurpose, fileType, objectName, and objectId are required',
        },
        { status: 400 }
      );
    }

    // Validate file upload configuration
    const validation = validateFileUpload(uploadPurpose, fileType);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid file', message: validation.error },
        { status: 400 }
      );
    }

    // Generate presigned URL
    const { presignedUrl, key, bucket } = await generatePresignedUrl(
      fileType,
      uploadPurpose,
      objectName,
      objectId
    );

    const response: FileUploadResponse = {
      presignedUrl,
      key,
      bucket,
      message: 'Pre-signed URL generated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
