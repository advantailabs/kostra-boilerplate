'use client';

import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { formatFileSize, getFileTypeCategoryIcon } from '@/lib/file-utils';
import { Download, Eye, Trash2 } from 'lucide-react';

interface FileCardProps {
  file: any;
  onDelete: () => void;
  onView: () => void;
  onDownload: () => void;
  isDownloading?: boolean;
}

// Simple date formatter
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function FileCard({
  file,
  onDelete,
  onView,
  onDownload,
  isDownloading = false,
}: FileCardProps) {
  const fileTypeConfig = getFileTypeCategoryIcon(file.mimeType || file.type);
  const FileIcon = fileTypeConfig.icon;
  const fileSize = formatFileSize(file.size);
  const uploadDate = formatDate(file.createdAt || file.uploadedAt);

  return (
    <Card className="group flex h-[200px] w-full flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50">
      {/* Header */}
      <div className="flex flex-shrink-0 items-start justify-between p-3 pb-2 sm:p-4 sm:pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${fileTypeConfig.color}`}
          >
            <FileIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold leading-tight text-gray-900 sm:text-base dark:text-gray-100">
              {file.name}
            </h3>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {fileSize} • {uploadDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            onClick={onView}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="View file"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={onDownload}
            disabled={isDownloading}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download file"
          >
            <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete file"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex h-full flex-col justify-between">
          <div className="flex-1">
            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
              {file.description || 'No description available'}
            </p>
          </div>

          {/* File type badge */}
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {file.mimeType || file.type || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
