# File Upload and Download System

This document describes the file upload and download system for the Kostra application.

## Overview

The system supports both file uploads and downloads using Cloudflare R2 (S3-compatible) storage. Files can be stored in either public or private buckets depending on the upload purpose.

## Upload System

### Upload Purposes

- **PersonaLogo**: Public bucket, images only (5MB max)
- **UserAvatar**: Public bucket, images only (2MB max)
- **UserFile**: Private bucket, various file types (10MB max)
- **ThreadAttachment**: Private bucket, documents and images (5MB max)
- **MessageAttachment**: Private bucket, documents and images (5MB max)
- **UserDocument**: Private bucket, extensive file type support (100MB max)

### Upload Process

1. Client requests pre-signed URL for upload
2. Server generates PUT pre-signed URL with 1-hour expiration
3. Client uploads file directly to R2 using the pre-signed URL
4. Server creates file record in database

## Download System

### Download Process

1. Client requests download URL for a file
2. Server validates user permissions (file ownership)
3. Server generates GET pre-signed URL with 1-hour expiration
4. Client downloads file using the pre-signed URL

### Security Features

- **Authentication**: Only authenticated users can request download URLs
- **Authorization**: Users can only download their own files
- **Temporary URLs**: Download URLs expire after 1 hour
- **Private Bucket**: Files are stored in private buckets for enhanced security

### API Endpoints

#### Generate Download URL

```
POST /api/files/[id]/download
```

**Response:**

```json
{
  "downloadUrl": "https://...",
  "expiresAt": "2024-01-01T12:00:00Z",
  "filename": "original-filename.pdf"
}
```

### Usage in Components

```typescript
import { useFileDownload } from '@/hooks/useFiles';

function MyComponent() {
  const downloadFileMutation = useFileDownload();

  const handleDownload = (fileId: number) => {
    downloadFileMutation.mutate(fileId);
  };

  return (
    <button
      onClick={() => handleDownload(file.id)}
      disabled={downloadFileMutation.isPending}
    >
      {downloadFileMutation.isPending ? 'Downloading...' : 'Download'}
    </button>
  );
}
```

## Configuration

### Environment Variables

The file upload system supports both AWS S3 and Cloudflare R2 storage. Configure the driver using the `NEXT_PUBLIC_FILE_STORAGE_DRIVER` environment variable.

#### File Storage Driver Configuration

```env
# File Storage Driver (s3 or r2)
NEXT_PUBLIC_FILE_STORAGE_DRIVER=r2
```

#### R2 Configuration (Default)

```env
# R2 Configuration
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ACCOUNT_ID=your_account_id
S3_PUBLIC_BASE_URL=https://your-public-bucket.your-subdomain.r2.cloudflarestorage.com
```

#### S3 Configuration

```env
# S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_PUBLIC_BUCKET_NAME=kostra-data-public
S3_PRIVATE_BUCKET_NAME=kostra-data-private
NEXT_PUBLIC_S3_PUBLIC_BASE_URL=https://your-public-bucket.s3.amazonaws.com
```

### Bucket Configuration

- **Public Bucket**: For files that need direct access (logos, avatars)
- **Private Bucket**: For sensitive files that require authentication (documents, attachments)

## File Storage Structure

Files are organized in the following structure:

```
bucket/
├── personas/logos/
├── users/avatars/
├── users/files/
├── users/documents/
├── threads/attachments/
└── messages/attachments/
```

Each file path includes:

- Purpose-specific prefix
- Object name (e.g., "user", "thread")
- Object ID
- Timestamp and UUID for uniqueness
- File extension

## Error Handling

The system includes comprehensive error handling for:

- Invalid file types
- File size limits
- Authentication failures
- Authorization failures
- Network errors
- Storage service errors

## Best Practices

1. **Always validate file types and sizes** before upload
2. **Use appropriate upload purposes** for different file types
3. **Implement proper error handling** in UI components
4. **Monitor download usage** for security and cost management
5. **Regularly audit file access** and permissions
