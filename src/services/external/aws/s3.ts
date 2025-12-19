import {
  getBucketName,
  getUploadPurposeConfig,
} from '@/services/internal/files/file-upload/file-upload-config';
import { UploadPurpose } from '@/types/file-upload';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Client-side environment variables (available in browser)
export const S3_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL;

function createS3Client() {
  const driver = process.env.NEXT_PUBLIC_FILE_STORAGE_DRIVER || 'r2';

  if (driver === 's3') {
    // S3 Configuration
    const { AWS_ACCESS_KEY_ID } = process.env;
    const { AWS_SECRET_ACCESS_KEY } = process.env;
    const { AWS_REGION } = process.env;

    if (!AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID is required');
    if (!AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY is required');

    return new S3Client({
      region: AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  // R2 Configuration (default)
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
  fileType: string,
  uploadPurpose: UploadPurpose,
  objectName: string,
  objectId: string | number
): Promise<{ presignedUrl: string; key: string; bucket: string }> {
  const purposeConfig = getUploadPurposeConfig(uploadPurpose);
  if (!purposeConfig) {
    throw new Error('Invalid upload purpose');
  }

  const bucketName = getBucketName(purposeConfig.bucket);
  const key = generateKey(purposeConfig.keyPrefix, objectName, objectId, fileType);
  const s3Client = createS3Client();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    // Add CORS headers for browser uploads
    Metadata: {
      'upload-purpose': uploadPurpose,
    },
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return { presignedUrl, key, bucket: bucketName };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

export async function generateDownloadUrl(
  bucket: string,
  key: string,
  filename?: string
): Promise<{ downloadUrl: string; expiresAt: Date }> {
  const s3Client = createS3Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: filename ? `attachment; filename="${filename}"` : undefined,
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    return { downloadUrl, expiresAt };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

function generateKey(
  keyPrefix: string,
  objectName: string,
  objectId: string | number,
  fileType: string
): string {
  const timestamp = Date.now();
  const uuid = randomUUID();
  const extension = getFileExtension(fileType);

  return `${keyPrefix}/${objectName}/${objectId}/${timestamp}-${uuid}${extension}`;
}

function getFileExtension(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  };
  return extensions[mimeType] || '';
}
