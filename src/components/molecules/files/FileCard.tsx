'use client';

import { Download, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { FileDetailsModal } from '@/components/molecules/files/FileDetailsModal';
import { DeleteFileDialog } from '@/components/organisms/modules/files/DeleteFileDialog';
import { useDeleteFile } from '@/hooks/useFiles';
import {
  formatFileSize,
  formatMimeType,
  getFileTypeIconWithColor,
} from '@/services/internal/files/file-upload/file-utils';

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

  const handleDeleteFileSuccess = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={`group flex h-[80px] w-full cursor-pointer flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${className}`}
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
              <h3 className="truncate text-xs font-semibold leading-tight text-text">
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
                  className="h-3 w-3 p-0 text-text-muted transition-colors duration-200 hover:bg-background-light hover:text-text sm:h-4 sm:w-4"
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
                  className="hover:bg-primary/10 flex items-center gap-2 px-2 py-1.5 text-xs text-text transition-colors duration-200 hover:text-primary"
                >
                  <div className="bg-primary/20 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded sm:h-3.5 sm:w-3.5">
                    <Eye className="h-1.5 w-1.5 text-primary sm:h-2 sm:w-2" />
                  </div>
                  <span className="truncate">View Details</span>
                </DropdownMenuItem>

                {/* Separator */}
                <div className="-mx-1 my-1 border-t border-border" />

                {/* Download Section */}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  disabled={isDownloading}
                  className="hover:bg-success/10 flex items-center gap-2 px-2 py-1.5 text-xs text-text transition-colors duration-200 hover:text-success disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="bg-success/20 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded sm:h-3.5 sm:w-3.5">
                    <Download className="h-1.5 w-1.5 text-success sm:h-2 sm:w-2" />
                  </div>
                  <span className="truncate">{isDownloading ? 'Downloading...' : 'Download'}</span>
                </DropdownMenuItem>

                {/* Separator */}
                <div className="-mx-1 my-1 border-t border-border" />

                {/* Delete Section */}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                  className="hover:bg-danger/10 flex items-center gap-2 px-2 py-1.5 text-xs text-danger transition-colors duration-200"
                >
                  <div className="bg-danger/20 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded sm:h-3.5 sm:w-3.5">
                    <Trash2 className="h-1.5 w-1.5 text-danger sm:h-2 sm:w-2" />
                  </div>
                  <span className="truncate">Delete File</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-shrink-0 items-center justify-between border-t border-border p-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <IconComponent className="h-2 w-2 flex-shrink-0 text-text-muted" />
            <span className="truncate text-xs text-text-muted">
              {formatMimeType(file.mimeType)}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-xs text-text-muted">{formatFileSize(file.size)}</div>
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
      <DeleteFileDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        fileId={file?.id || null}
        fileName={file?.originalName || ''}
        onSuccess={handleDeleteFileSuccess}
        deleteFile={deleteFileMutation.mutateAsync}
        isDeleting={deleteFileMutation.isPending}
      />
    </>
  );
}
