'use client';

import { Calendar, HardDrive } from 'lucide-react';

import { Modal } from '@/components/molecules/common/Modal';
import { File } from '@/lib/prisma/generated/browser';
import { formatFileSize } from '@/services/internal/files/file-upload/file-utils';

interface FileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export function FileDetailsModal({
  isOpen,
  onClose,
  file,
  onDownload,
  isDownloading = false,
}: FileDetailsModalProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_error) {
      return 'Invalid Date';
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  if (!file) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={file.originalName}
      description={file.mimeType}
      maxWidth="max-w-2xl"
      secondaryActionText="Close"
      primaryActionText="Download"
      onPrimaryAction={handleDownload}
      isPrimaryActionDisabled={!onDownload}
      isPrimaryActionLoading={isDownloading}
      contentClassName="overflow-hidden"
    >
      <div className="space-y-6 py-2">
        {/* File Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4 text-text-muted" />
              <span className="font-medium text-text">File Size</span>
            </div>
            <p className="ml-6 text-sm text-text-muted">{formatFileSize(file.size)}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="font-medium text-text">Uploaded</span>
            </div>
            <p className="ml-6 text-sm text-text-muted">{formatDate(String(file.createdAt))}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
