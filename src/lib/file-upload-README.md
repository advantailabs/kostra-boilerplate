# File Upload System

This document describes the new dynamic file upload system that supports multiple upload purposes, buckets, and file types.

## Overview

The file upload system is designed to be flexible and scalable, supporting:

- Multiple upload purposes (PersonaLogo, UserAvatar, UserFile, etc.)
- Public and private buckets
- Configurable file type restrictions
- Dynamic key generation based on object details

## Configuration

### Upload Purposes

Each upload purpose is configured with:

- **Bucket**: 'public' or 'private'
- **Allowed MIME Types**: Array of allowed file types
- **Max File Size**: Maximum file size in bytes
- **Key Prefix**: Base path for file storage

### Current Upload Purposes

1. **PersonaLogo** (Public)

   - Allowed: image/jpeg, image/png, image/gif, image/webp
   - Max Size: 5MB
   - Key Prefix: personas/logos

2. **UserAvatar** (Public)

   - Allowed: image/jpeg, image/png, image/gif, image/webp
   - Max Size: 2MB
   - Key Prefix: users/avatars

3. **UserFile** (Private)

   - Allowed: PDF, text, Word, Excel, images
   - Max Size: 10MB
   - Key Prefix: users/files

4. **ThreadAttachment** (Private)

   - Allowed: PDF, text, images
   - Max Size: 5MB
   - Key Prefix: threads/attachments

5. **MessageAttachment** (Private)
   - Allowed: PDF, text, images
   - Max Size: 5MB
   - Key Prefix: messages/attachments

## Usage

### Using the Hook

```typescript
import { useFileUpload } from '@/hooks/useFileUpload';

function MyComponent() {
  const { uploadFile, isUploading, error } = useFileUpload({
    uploadPurpose: 'PersonaLogo',
    objectName: 'persona',
    objectId: personaId,
    onSuccess: (url) => {
      console.log('File uploaded:', url);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFileChange = async (file: File) => {
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      // File uploaded successfully
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleFileChange(e.target.files?.[0])}
      disabled={isUploading}
    />
  );
}
```

### Using the API Directly

```typescript
import { fileUploadApi } from '@/services/api/file-upload';

const uploadFile = async (file: File) => {
  // Get presigned URL
  const { presignedUrl, key } = await fileUploadApi.getPresignedUrl({
    uploadPurpose: 'PersonaLogo',
    fileType: file.type,
    objectName: 'persona',
    objectId: personaId,
  });

  // Upload to S3
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (response.ok) {
    return key; // Return the file key
  }
};
```

## Key Generation

Files are stored with keys following this pattern:

```
{keyPrefix}/{objectName}/{objectId}/{timestamp}-{uuid}.{extension}
```

Example:

```
personas/logos/persona/123/1703123456789-abc123-def456.jpg
```

## Environment Variables

Required environment variables:

- `R2_PUBLIC_BUCKET_NAME`: Public bucket name (default: peon-data-public)
- `R2_PRIVATE_BUCKET_NAME`: Private bucket name (default: peon-data-private)
- `NEXT_PUBLIC_R2_PUBLIC_BUCKET_NAME`: Public bucket name for client-side
- `NEXT_PUBLIC_R2_ACCOUNT_ID`: R2 account ID for client-side

## Adding New Upload Purposes

1. Add the purpose to the `UploadPurpose` type in `src/types/file-upload.ts`
2. Add configuration to `FILE_UPLOAD_CONFIG` in `src/lib/file-upload-config.ts`
3. Update validation logic if needed

Example:

```typescript
// In types/file-upload.ts
export type UploadPurpose = 'PersonaLogo' | 'UserAvatar' | 'NewPurpose'; // Add here

// In lib/file-upload-config.ts
export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  purposes: {
    // ... existing purposes
    NewPurpose: {
      bucket: 'public',
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      maxFileSize: 1 * 1024 * 1024, // 1MB
      keyPrefix: 'new-purpose/files',
    },
  },
  // ... rest of config
};
```
