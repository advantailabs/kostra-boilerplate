import { FileUploadConfig, UploadPurpose } from '@/types/file-upload';

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  purposes: {
    UserAvatar: {
      bucket: 'public',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      keyPrefix: 'users/avatars',
    },
    MessageAttachment: {
      bucket: 'private',
      allowedMimeTypes: [
        // Source code and text formats
        'text/x-c',
        'text/x-c++',
        'text/x-csharp',
        'text/css',
        'text/x-golang',
        'text/html',
        'text/x-java',
        'text/javascript',
        'application/json',
        'text/markdown',
        'text/x-php',
        'text/x-python',
        'text/x-script.python',
        'text/x-ruby',
        'application/x-sh',
        'text/x-tex',
        'application/typescript',
        'text/plain',
        // Documents
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        // PDF
        'application/pdf',
      ],
      allowedExtensions: [
        '.c',
        '.cpp',
        '.cs',
        '.css',
        '.doc',
        '.docx',
        '.go',
        '.html',
        '.java',
        '.js',
        '.json',
        '.md',
        '.pdf',
        '.php',
        '.pptx',
        '.py',
        '.rb',
        '.sh',
        '.tex',
        '.ts',
        '.txt',
      ],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keyPrefix: 'messages/attachments',
    },
    UserDocument: {
      bucket: 'private',
      allowedMimeTypes: [
        // Text files
        'text/x-c',
        'text/x-c++',
        'text/x-csharp',
        'text/css',
        'text/html',
        'text/x-golang',
        'text/x-java',
        'text/javascript',
        'application/json',
        'text/markdown',
        'text/x-php',
        'text/x-python',
        'text/x-script.python',
        'text/x-ruby',
        'text/x-tex',
        'application/typescript',
        'text/plain',
        // Documents
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        // Scripts
        'application/x-sh',
        // PDF
        'application/pdf',
      ],
      maxFileSize: 100 * 1024 * 1024, // 100MB
      keyPrefix: 'users/documents',
    },
    BlogImage: {
      bucket: 'public',
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keyPrefix: 'blogs/images',
    },
  },
  buckets: {
    public: process.env.S3_PUBLIC_BUCKET_NAME || 'kostra-data-public',
    private: process.env.S3_PRIVATE_BUCKET_NAME || 'kostra-data-private',
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
