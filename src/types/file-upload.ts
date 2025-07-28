export type UploadPurpose =
  | 'PersonaLogo'
  | 'UserAvatar'
  | 'UserFile'
  | 'ThreadAttachment'
  | 'MessageAttachment'
  | 'UserDocument'; // New purpose for file explorer

export interface UploadPurposeConfig {
  bucket: 'public' | 'private';
  allowedMimeTypes: string[];
  maxFileSize: number; // in bytes
  keyPrefix: string;
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
