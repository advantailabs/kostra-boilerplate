export type UploadPurpose = 'UserAvatar' | 'MessageAttachment' | 'UserDocument' | 'BlogImage';

export interface UploadPurposeConfig {
  bucket: 'public' | 'private';
  allowedMimeTypes: string[];
  maxFileSize: number; // in bytes
  keyPrefix: string;
  allowedExtensions?: string[]; // e.g., ['.pdf', '.txt'] for client-side file picker
}

export interface FileUploadRequest {
  uploadPurpose: UploadPurpose;
  fileType: string;
  objectName: string;
  objectId: string | number;
}

export interface FileUploadResponse {
  presignedUrl: string;
  key: string;
  bucket: string;
  message: string;
}

export interface FileUploadConfig {
  purposes: Record<UploadPurpose, UploadPurposeConfig>;
  buckets: {
    public: string;
    private: string;
  };
}
