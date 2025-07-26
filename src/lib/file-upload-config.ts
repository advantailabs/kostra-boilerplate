import { FileUploadConfig, UploadPurpose } from '@/types/file-upload';

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  purposes: {
    PersonaLogo: {
      bucket: 'public',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keyPrefix: 'personas/logos',
    },
    UserAvatar: {
      bucket: 'public',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      keyPrefix: 'users/avatars',
    },
    UserFile: {
      bucket: 'private',
      allowedMimeTypes: [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keyPrefix: 'users/files',
    },
    ThreadAttachment: {
      bucket: 'private',
      allowedMimeTypes: [
        'application/pdf',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keyPrefix: 'threads/attachments',
    },
    MessageAttachment: {
      bucket: 'private',
      allowedMimeTypes: [
        'application/pdf',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keyPrefix: 'messages/attachments',
    },
  },
  buckets: {
    public: process.env.R2_PUBLIC_BUCKET_NAME || 'peon-data-public',
    private: process.env.R2_PRIVATE_BUCKET_NAME || 'peon-data-private',
  },
};

export function getUploadPurposeConfig(purpose: UploadPurpose) {
  return FILE_UPLOAD_CONFIG.purposes[purpose];
}

export function getBucketName(bucketType: 'public' | 'private') {
  return FILE_UPLOAD_CONFIG.buckets[bucketType];
}

export function validateFileUpload(
  purpose: UploadPurpose,
  fileType: string,
  fileSize?: number
): { isValid: boolean; error?: string } {
  const config = getUploadPurposeConfig(purpose);

  if (!config) {
    return { isValid: false, error: 'Invalid upload purpose' };
  }

  if (!config.allowedMimeTypes.includes(fileType)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`,
    };
  }

  if (fileSize && fileSize > config.maxFileSize) {
    const maxSizeMB = config.maxFileSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
}
