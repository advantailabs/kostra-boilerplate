import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Client-side environment variables (available in browser)
const CLIENT_ACCOUNT_ID = process.env.NEXT_PUBLIC_R2_ACCOUNT_ID;
const CLIENT_BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;

export const S3_BASE_URL =
  CLIENT_ACCOUNT_ID && CLIENT_BUCKET_NAME
    ? `https://pub-${CLIENT_ACCOUNT_ID}.r2.dev/${CLIENT_BUCKET_NAME}`
    : '';

function createS3Client() {
  // Server-side environment variables validation
  const { R2_ACCESS_KEY_ID } = process.env;
  const { R2_SECRET_ACCESS_KEY } = process.env;
  const { R2_ACCOUNT_ID } = process.env;

  if (!R2_ACCESS_KEY_ID) throw new Error('R2_ACCESS_KEY_ID is required');
  if (!R2_SECRET_ACCESS_KEY) throw new Error('R2_SECRET_ACCESS_KEY is required');
  if (!R2_ACCOUNT_ID) throw new Error('R2_ACCOUNT_ID is required');

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function generatePresignedUrl(
  fileType: string
): Promise<{ presignedUrl: string; key: string }> {
  // Validate bucket name on each call (server-side only)
  const { R2_BUCKET_NAME } = process.env;
  if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is required');

  const key = `persona-logos/${randomUUID()}${getFileExtension(fileType)}`;
  const s3Client = createS3Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return { presignedUrl, key };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

function getFileExtension(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  };
  return extensions[mimeType] || '';
}
