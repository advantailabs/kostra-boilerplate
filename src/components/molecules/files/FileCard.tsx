'use client';

import { Download, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { FileDetailsModal } from '@/components/molecules/files/FileDetailsModal';
import { useDeleteFile } from '@/hooks/useFiles';
import { formatFileSize, formatMimeType, getFileTypeIconWithColor } from '@/lib/file-utils';

interface FileCardProps {
  file: any;
  onDelete: () => void;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
  isDownloading?: boolean;
}

export function FileCard({
  file,
  onDelete,
  onView: _onView,
  onDownload,
  className,
  isDownloading = false,
}: FileCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteFileMutation = useDeleteFile();

  const { icon: IconComponent, color } = getFileTypeIconWithColor(file.mimeType);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteFile = async () => {
    try {
      await deleteFileMutation.mutateAsync({ id: file.id });
      onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <>
      <Card
        className={`group flex h-[80px] w-full cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 ${className}`}
        onClick={handleViewDetails}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between p-2 pb-1 sm:p-3 sm:pb-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md sm:h-5 sm:w-5 ${color}`}
            >
              <IconComponent className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-semibold leading-tight text-gray-900 dark:text-gray-100">
                {file.originalName}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ml-1 flex flex-shrink-0 items-center gap-1 sm:ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-3 w-3 p-0 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 sm:h-4 sm:w-4 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-2 w-2 sm:h-2.5 sm:w-2.5" aria-label="More options" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px] p-1 sm:w-[272px]" align="end">
                {/* View Details Section */}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                >
                  <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded bg-blue-100 sm:h-3.5 sm:w-3.5 dark:bg-blue-900/30">
                    <Eye className="h-1.5 w-1.5 text-blue-600 sm:h-2 sm:w-2 dark:text-blue-400" />
                  </div>
                  <span className="truncate">View Details</span>
                </DropdownMenuItem>

                {/* Separator */}
                <div className="-mx-1 my-1 border-t border-gray-200 dark:border-gray-700" />

                {/* Download Section */}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                >
                  <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded bg-green-100 sm:h-3.5 sm:w-3.5 dark:bg-green-900/30">
                    <Download className="h-1.5 w-1.5 text-green-600 sm:h-2 sm:w-2 dark:text-green-400" />
                  </div>
                  <span className="truncate">{isDownloading ? 'Downloading...' : 'Download'}</span>
                </DropdownMenuItem>

                {/* Separator */}
                <div className="-mx-1 my-1 border-t border-gray-200 dark:border-gray-700" />

                {/* Delete Section */}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-700 transition-colors duration-200 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded bg-red-100 sm:h-3.5 sm:w-3.5 dark:bg-red-900/30">
                    <Trash2 className="h-1.5 w-1.5 text-red-600 sm:h-2 sm:w-2 dark:text-red-400" />
                  </div>
                  <span className="truncate">Delete File</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-shrink-0 items-center justify-between border-t border-gray-100 p-2 dark:border-gray-800">
          <div className="flex min-w-0 items-center gap-1.5">
            <IconComponent className="h-2 w-2 flex-shrink-0 text-gray-500" />
            <span className="truncate text-xs text-gray-500">{formatMimeType(file.mimeType)}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
          </div>
        </div>
      </Card>

      {/* File Details Modal */}
      <FileDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        file={file}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      {/* Delete File Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description={`Are you sure you want to permanently delete "${file?.originalName}"? This will delete the file from storage. This action cannot be undone.`}
        confirmText="Delete File"
        isLoading={deleteFileMutation.isPending}
      />
    </>
  );
}
