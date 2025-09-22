import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { getBucketName } from '@/lib/file-upload-config';
import { generateDownloadUrl } from '@/lib/s3';
import {
  errorResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { findFileById } from '@/services/repositories/file';
import { getUserById } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);
    if (!user) {
      return unauthorizedResponse();
    }

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return errorResponse('Invalid file ID', 400);
    }

    // Get file details from database
    const fileResult = await findFileById(fileId);
    if (!fileResult.success || !fileResult.data) {
      return notFoundResponse('File not found');
    }

    const file = fileResult.data;

    // Check if user owns the file
    if (file.userId !== user.id) {
      return forbiddenResponse('Access denied');
    }

    // Use the filename as the storage key and get the correct private bucket name
    const key = file.url || file.filename;
    const bucket = getBucketName('private');

    // Generate download URL
    const { downloadUrl, expiresAt } = await generateDownloadUrl(bucket, key, file.originalName);

    return successResponse({
      downloadUrl,
      expiresAt,
      filename: file.originalName,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return internalServerErrorResponse('Failed to generate download URL');
  }
}
