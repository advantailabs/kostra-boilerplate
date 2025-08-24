import { FREE_LIMITS } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
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
import { findPersonaByUserAndId } from '@/services/repositories/persona';
import { getUserByGoogleId } from '@/services/repositories/user';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) return unauthorizedResponse();

    // Get user from database
    const user = await getUserByGoogleId(authUser.googleId);
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

    // Enforce ownership/authorization by purpose
    switch (uploadPurpose) {
      case 'PersonaLogo': {
        const personaId = Number(objectId);
        if (Number.isNaN(personaId)) {
          return validationErrorResponse('Invalid input data', [
            { field: 'objectId', message: 'Persona ID must be a number' },
          ]);
        }
        const persona = await findPersonaByUserAndId(user.id, personaId);
        if (!persona) return notFoundResponse('Persona not found');
        break;
      }
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
