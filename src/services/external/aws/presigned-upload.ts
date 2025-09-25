import { fileUploadApi } from '@/services/api/file-upload';
import { UploadPurpose } from '@/types/file-upload';

export interface PresignedUploadParams {
  file: File;
  uploadPurpose: UploadPurpose;
  objectName: string;
  objectId: string | number;
  onProgress?: (_percent: number) => void;
}

export interface PresignedUploadResult {
  key: string;
}

/**
 * Uploads a file to S3 (or compatible) using a server-generated presigned URL.
 * Provides progress updates via XHR for reliable browser support.
 */
export async function uploadFileViaPresignedUrl(
  params: PresignedUploadParams
): Promise<PresignedUploadResult> {
  const { file, uploadPurpose, objectName, objectId, onProgress } = params;

  const { presignedUrl, key } = await fileUploadApi.getPresignedUrl({
    uploadPurpose,
    fileType: file.type,
    objectName,
    objectId,
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          onProgress((e.loaded / e.total) * 100);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });

  return { key };
}
