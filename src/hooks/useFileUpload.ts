import { personasApi } from '@/services/api/personas';
import { useCallback, useState } from 'react';

interface UseFileUploadOptions {
  onSuccess?: (_url: string) => void;
  onError?: (_error: string) => void;
}

interface UseFileUploadReturn {
  uploadFile: (_file: File) => Promise<string | null>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Generate pre-signed URL
      const { presignedUrl, key } = await personasApi.getPresignedUrl(file.type);

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

      const fileUrl = key;
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
