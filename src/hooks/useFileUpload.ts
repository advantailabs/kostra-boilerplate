import { fileUploadApi } from '@/services/api/file-upload';
import { S3_PUBLIC_BASE_URL } from '@/services/external/aws/s3';
import { getUploadPurposeConfig } from '@/services/internal/files/file-upload/file-upload-config';
import { UploadPurpose } from '@/types/file-upload';
import { useCallback, useState } from 'react';

interface UseFileUploadOptions {
  uploadPurpose: UploadPurpose;
  objectName: string;
  objectId: string | number;
  onSuccess?: (_url: string) => void;
  onError?: (_error: string) => void;
}

interface UseFileUploadReturn {
  uploadFile: (_file: File) => Promise<string | null>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Generate pre-signed URL
      const { presignedUrl, key } = await fileUploadApi.getPresignedUrl({
        uploadPurpose: options.uploadPurpose,
        fileType: file.type,
        objectName: options.objectName,
        objectId: options.objectId,
      });

      // Upload file to S3
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Construct the full URL based on the upload purpose
      const purposeConfig = getUploadPurposeConfig(options.uploadPurpose);
      let fileUrl: string;

      if (purposeConfig?.bucket === 'public' && S3_PUBLIC_BASE_URL) {
        // For public uploads, construct the full public URL
        fileUrl = `${S3_PUBLIC_BASE_URL}/${key}`;
      } else {
        // For private uploads, return just the key (will need signed URL for access)
        fileUrl = key;
      }

      options.onSuccess?.(fileUrl);
      return fileUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    error,
    clearError,
  };
}
