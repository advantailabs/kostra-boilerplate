import { UploadPurpose } from '@/types/file-upload';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { getBucketName, getUploadPurposeConfig } from './file-upload-config';

// Client-side environment variables (available in browser)
export const S3_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;

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
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return { presignedUrl, key, bucket: bucketName };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
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
