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
import { getUserByClerkId } from '@/services/repositories/user';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(userId);

    if (!user) {
      return notFoundResponse('User not found');
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

    // Use the filename as the S3 key and default to private bucket
    const key = file.url || file.filename;
    const bucket = process.env.R2_PRIVATE_BUCKET_NAME || 'peon-data-private';

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
