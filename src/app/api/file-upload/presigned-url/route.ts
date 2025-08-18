import { FREE_LIMITS } from '@/data/config/plans';
import { validateFileUpload } from '@/lib/file-upload-config';
import { prisma } from '@/lib/prisma';
import { generatePresignedUrl } from '@/lib/s3';
import {
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { getUserByClerkId } from '@/services/repositories/user';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) return unauthorizedResponse();

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) return notFoundResponse('User does not exist');

    const body: FileUploadRequest = await request.json();
    const { uploadPurpose, fileType, objectName, objectId } = body;

    // Validate required fields
    if (!uploadPurpose || !fileType || !objectName || objectId === undefined) {
      return validationErrorResponse('Invalid input data', [
        { field: 'uploadPurpose', message: 'uploadPurpose is required' },
        { field: 'fileType', message: 'fileType is required' },
        { field: 'objectName', message: 'objectName is required' },
        { field: 'objectId', message: 'objectId is required' },
      ]);
    }

    // Enforce Free plan total files for MessageAttachment and UserDocument
    if (uploadPurpose === 'MessageAttachment' || uploadPurpose === 'UserDocument') {
      if (user.plan === 'FREE') {
        const totalFiles = await prisma.file.count({ where: { userId: user.id, deletedAt: null } });
        if (totalFiles >= FREE_LIMITS.filesTotal) {
          return insufficientCreditsResponse(
            'Free plan limit reached: You can upload up to 50 total files.'
          );
        }
      }
    }

    // Validate file upload configuration
    const validation = validateFileUpload(uploadPurpose, fileType);
    if (!validation.isValid) {
      return validationErrorResponse('Invalid file', [
        { field: 'fileType', message: validation.error || 'Unsupported file type' },
      ]);
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

    return successResponse(response);
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return internalServerErrorResponse();
  }
}
