import { generateDownloadUrl } from '@/lib/s3';
import { findFileById } from '@/services/repositories/file';
import { getUserByClerkId } from '@/services/repositories/user';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const fileId = parseInt(params.id, 10);
    if (Number.isNaN(fileId)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Get file details from database
    const fileResult = await findFileById(fileId);
    if (!fileResult.success || !fileResult.data) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = fileResult.data;

    // Check if user owns the file
    if (file.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Use the filename as the S3 key and default to private bucket
    const key = file.url || file.filename;
    const bucket = process.env.R2_PRIVATE_BUCKET_NAME || 'peon-data-private';

    // Generate download URL
    const { downloadUrl, expiresAt } = await generateDownloadUrl(bucket, key, file.originalName);

    return NextResponse.json({
      downloadUrl,
      expiresAt,
      filename: file.originalName,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
