'use client';

import { RiDownloadLine } from '@remixicon/react';

import { Avatar } from '@/components/atom/Avatar';
import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';

interface FileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: any;
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
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  if (!file) return null;

  // Extract knowledge bases from file data
  const knowledgeBases = file.fileKnowledgeBases?.map((fkb: any) => fkb.knowledgeBase) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {file.originalName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* File Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">File Type:</span>
                <p className="text-gray-600 dark:text-gray-400">{file.mimeType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">File Size:</span>
                <p className="text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(file.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Last Modified:</span>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(file.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Knowledge Bases Section */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Knowledge Bases ({knowledgeBases.length})
            </h4>

            {knowledgeBases.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {knowledgeBases.map((kb: any) => (
                  <div
                    key={kb.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {kb.title}
                      </h5>
                      <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                        {kb.description}
                      </p>

                      {/* Personas using this knowledge base */}
                      {kb.personas && kb.personas.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                            Used by:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {kb.personas.map((persona: any) => (
                              <Badge
                                key={persona.id}
                                variant="neutral"
                                className="flex items-center gap-1 text-xs"
                              >
                                <Avatar
                                  src={persona.logo}
                                  alt={`${persona.name} avatar`}
                                  fallback={persona.name}
                                  size="sm"
                                  className="h-3 w-3"
                                />
                                {persona.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This file is not associated with any knowledge bases.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="-mx-6 mt-6 border-t border-gray-200 dark:border-gray-700" />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="secondary" onClick={onClose} className="px-4">
            Close
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4"
          >
            <RiDownloadLine className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
