'use client';

import {
  RiDeleteBinLine,
  RiDownloadLine,
  RiEyeLine,
  RiFileExcelLine,
  RiFileImageLine,
  RiFileLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiFileWordLine,
  RiMoreLine,
} from '@remixicon/react';
import { useState } from 'react';

import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { useDeleteFile } from '@/hooks/useFiles';
import { FileDetailsModal } from './FileDetailsModal';

interface FileCardProps {
  file: any;
  onDelete: () => void;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function FileCard({ file, onDelete, onView, onDownload, className }: FileCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteFileMutation = useDeleteFile();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return { icon: RiFilePdfLine, color: 'bg-red-500 text-white' };
    }
    if (mimeType.startsWith('image/')) {
      return { icon: RiFileImageLine, color: 'bg-purple-500 text-white' };
    }
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      return { icon: RiFileTextLine, color: 'bg-blue-500 text-white' };
    }
    if (mimeType === 'application/json') {
      return { icon: RiFileTextLine, color: 'bg-green-500 text-white' };
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return { icon: RiFileExcelLine, color: 'bg-green-600 text-white' };
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return { icon: RiFileWordLine, color: 'bg-blue-600 text-white' };
    }
    // Fallback for unknown file types
    return { icon: RiFileLine, color: 'bg-gray-500 text-white' };
  };

  const { icon: IconComponent, color } = getFileTypeIcon(file.mimeType);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (file?.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFileMutation.mutateAsync({ id: file.id, permanent: true });
      onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Extract knowledge bases and personas from file data
  const knowledgeBases = file.fileKnowledgeBases?.map((fkb: any) => fkb.knowledgeBase) || [];
  const allPersonas = knowledgeBases.flatMap((kb: any) => kb.personas || []);

  return (
    <>
      <Card
        className={`group flex min-h-[110px] min-w-[220px] cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 ${className}`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between p-3 pb-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${color}`}
            >
              <IconComponent className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-semibold leading-tight text-gray-900 dark:text-gray-100">
                {file.originalName}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-5 w-5 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <RiMoreLine className="h-3 w-3" aria-label="More options" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleViewDetails}>
                  <RiEyeLine className="mr-2 h-3 w-3" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <RiDownloadLine className="mr-2 h-3 w-3" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  <RiDeleteBinLine className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-3 pb-2">
          <p className="flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {file.mimeType}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 px-3 py-2 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <RiFileLine className="h-3 w-3 flex-shrink-0" />
            <span>{formatFileSize(file.size)}</span>
          </div>
          <div className="flex items-center gap-2">
            {allPersonas.length > 0 && (
              <div className="flex -space-x-1">
                {allPersonas.slice(0, 3).map((persona: any) => (
                  <Avatar
                    key={persona.id}
                    src={persona.logo}
                    alt={`${persona.name} avatar`}
                    fallback={persona.name}
                    size="sm"
                    className="h-4 w-4 border border-white dark:border-gray-800"
                  />
                ))}
                {allPersonas.length > 3 && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    +{allPersonas.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* File Details Modal */}
      <FileDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        file={file}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete File"
        description={`Are you sure you want to permanently delete "${file?.originalName}"? This action cannot be undone.`}
        isLoading={deleteFileMutation.isPending}
      />
    </>
  );
}
