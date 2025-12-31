import { UploadPurpose } from '@/types/file-upload';
import {
  RemixiconComponentType,
  RiFile3Line,
  RiFileCodeLine,
  RiFileExcelLine,
  RiFileImageLine,
  RiFilePdfLine,
  RiFilePptLine,
  RiFileTextLine,
  RiFileVideoLine,
  RiFileWordLine,
  RiFileZipLine,
} from '@remixicon/react';
import { FileImage, FileSpreadsheet, FileText, FileType } from 'lucide-react';

/**
 * Returns the appropriate icon component based on file mime type
 * Uses Remix icons for consistent icon style
 */
export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return RiFileImageLine;
  if (mimeType.startsWith('video/')) return RiFileVideoLine;
  if (mimeType.includes('pdf')) return RiFilePdfLine;
  if (mimeType.includes('word') || mimeType.includes('docx')) return RiFileWordLine;
  if (mimeType.includes('excel') || mimeType.includes('xlsx')) return RiFileExcelLine;
  if (mimeType.includes('powerpoint') || mimeType.includes('pptx')) return RiFilePptLine;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return RiFileZipLine;
  if (
    mimeType.includes('javascript') ||
    mimeType.includes('typescript') ||
    mimeType.includes('json') ||
    mimeType.includes('html') ||
    mimeType.includes('css')
  )
    return RiFileCodeLine;
  if (mimeType.includes('text')) return RiFileTextLine;
  return RiFile3Line;
};

/**
 * Formats file size in bytes to human-readable format (e.g., KB, MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

/**
 * Formats MIME type to a more human-readable format
 */
export const formatMimeType = (mimeType: string): string => {
  // Handle common MIME types with friendly names
  if (mimeType === 'application/pdf') return 'PDF Document';
  if (mimeType.startsWith('image/')) return 'Image File';
  if (mimeType === 'text/plain') return 'Text File';
  if (mimeType === 'text/markdown') return 'Markdown File';
  if (mimeType === 'application/json') return 'JSON File';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel Spreadsheet';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word Document';

  // For other types, extract the main type and subtype
  const parts = mimeType.split('/');
  if (parts.length === 2) {
    const [type, subtype] = parts;
    // Capitalize and format the type
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const formattedSubtype = subtype.split('.').pop()?.toUpperCase() || subtype;
    return `${formattedType} (${formattedSubtype})`;
  }

  // Fallback: truncate if too long
  return mimeType.length > 20 ? `${mimeType.substring(0, 20)}...` : mimeType;
};

/**
 * Returns an icon and color scheme based on file mime type for UI display
 * using Lucide icons (separate from Remix icons used in getFileIcon)
 */
export const getFileTypeIconWithColor = (mimeType: string) => {
  if (mimeType === 'application/pdf') {
    return {
      icon: FileText,
      color: 'bg-red-500 text-white',
      textColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    };
  }
  if (mimeType.startsWith('image/')) {
    return {
      icon: FileImage,
      color: 'bg-purple-500 text-white',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    };
  }
  if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
    return {
      icon: FileText,
      color: 'bg-blue-500 text-white',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    };
  }
  if (mimeType === 'application/json') {
    return {
      icon: FileText,
      color: 'bg-green-500 text-white',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    };
  }
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return {
      icon: FileSpreadsheet,
      color: 'bg-green-600 text-white',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    };
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return {
      icon: FileType,
      color: 'bg-blue-600 text-white',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    };
  }
  // Fallback for unknown file types
  return {
    icon: FileText,
    color: 'bg-gray-500 text-white',
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
  };
};

/**
 * Returns icon and color for file type categories (not mime types)
 */
export const getFileTypeCategoryIcon = (type: string) => {
  const fileTypeConfig: Record<string, { icon: RemixiconComponentType; color: string }> = {
    PDF: {
      icon: FileText,
      color: 'bg-red-500 text-white',
    },
    Excel: {
      icon: FileSpreadsheet,
      color: 'bg-green-500 text-white',
    },
    Document: {
      icon: FileType,
      color: 'bg-blue-500 text-white',
    },
    Image: {
      icon: FileImage,
      color: 'bg-purple-500 text-white',
    },
  };

  const config = fileTypeConfig[type];
  if (!config) {
    return { icon: FileText, color: 'bg-gray-500 text-white' };
  }
  return config;
};

/**
 * Mapping of S3 key prefixes to their corresponding upload purposes.
 * This configuration is exported to allow reuse and easier testing/mocking.
 */
export const PREFIX_TO_PURPOSE: ReadonlyArray<{
  prefix: string;
  purpose: UploadPurpose;
}> = [
  { prefix: 'messages/attachments/', purpose: 'MessageAttachment' },
  { prefix: 'users/documents/', purpose: 'UserDocument' },
  { prefix: 'users/avatars/', purpose: 'UserAvatar' },
] as const;

/**
 * Infers upload purpose from an S3 key prefix.
 * Example prefixes:
 * - messages/attachments/ → MessageAttachment
 * - users/documents/ → UserDocument
 * - users/avatars/ → UserAvatar
 */
export function inferUploadPurposeFromKey(key: string): UploadPurpose | undefined {
  for (const mapping of PREFIX_TO_PURPOSE) {
    if (key.startsWith(mapping.prefix)) {
      return mapping.purpose;
    }
  }
  return undefined;
}
