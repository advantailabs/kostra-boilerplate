import { FREE_LIMITS } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import {
  insufficientCreditsResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { generatePresignedUrl } from '@/services/external/aws/s3';
import { validateFileUpload } from '@/services/internal/files/file-upload/file-upload-config';
import { getUserById } from '@/services/repositories/user';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) return unauthorizedResponse();

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
        const totalFiles = await prisma.file.count({
          where: { userId: user.id, deletedAt: null },
        });
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

    // Enforce ownership/authorization by purpose
    switch (uploadPurpose) {
      case 'UserAvatar': {
        // Only the current user can upload their avatar. objectId must match user.id
        const userId = Number(objectId);
        if (Number.isNaN(userId) || userId !== user.id) return notFoundResponse('User not found');
        break;
      }
      case 'MessageAttachment': {
        // Allowed for any authenticated user for their own content; no foreign resource id
        // objectId is threadId or any client-side context; do not authorize against DB here
        break;
      }
      case 'UserDocument': {
        // Uploading documents for the current user only
        const userId = Number(objectId);
        if (Number.isNaN(userId) || userId !== user.id) return notFoundResponse('User not found');
        break;
      }
      case 'BlogImage': {
        // Allow upload for new blogs (objectId = 0) or existing blogs
        const blogId = Number(objectId);
        if (Number.isNaN(blogId)) {
          return validationErrorResponse('Invalid input data', [
            { field: 'objectId', message: 'Blog ID must be a number' },
          ]);
        }
        // For now, allow any authenticated user to upload blog images
        // You can add blog ownership validation here if needed
        break;
      }
      default:
        break;
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
