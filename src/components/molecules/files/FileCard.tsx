'use client';

import {
  Download,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  MoreHorizontal,
  Trash2,
  Unlink,
} from 'lucide-react';
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
import { useRemoveFileFromKnowledgeBase } from '@/hooks/useKnowledgeBases';
import { FileDetailsModal } from './FileDetailsModal';

interface FileCardProps {
  file: any;
  onDelete: () => void;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
  isDownloading?: boolean;
  showKnowledgeBaseOptions?: boolean;
  onRemoveFromKnowledgeBase?: () => void;
  onDeleteFile?: () => void;
  knowledgeBaseInfo?: {
    id: number;
    title: string;
    description: string;
    personas?: Array<{
      id: number;
      name: string;
      description: string;
      logo: string | null;
    }>;
  };
}

export function FileCard({
  file,
  onDelete,
  onView: _onView,
  onDownload,
  className,
  isDownloading = false,
  showKnowledgeBaseOptions = false,
  onRemoveFromKnowledgeBase,
  onDeleteFile,
  knowledgeBaseInfo,
}: FileCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const deleteFileMutation = useDeleteFile();
  const removeFromKBMutation = useRemoveFileFromKnowledgeBase();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return { icon: FileText, color: 'bg-red-500 text-white' };
    }
    if (mimeType.startsWith('image/')) {
      return { icon: FileImage, color: 'bg-purple-500 text-white' };
    }
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      return { icon: FileText, color: 'bg-blue-500 text-white' };
    }
    if (mimeType === 'application/json') {
      return { icon: FileText, color: 'bg-green-500 text-white' };
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return { icon: FileSpreadsheet, color: 'bg-green-600 text-white' };
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return { icon: FileType, color: 'bg-blue-600 text-white' };
    }
    // Fallback for unknown file types
    return { icon: FileText, color: 'bg-gray-500 text-white' };
  };

  const formatMimeType = (mimeType: string) => {
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

  const { icon: IconComponent, color } = getFileTypeIcon(file.mimeType);

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

  const handleRemoveFromKnowledgeBase = () => {
    setShowRemoveDialog(true);
  };

  const handleDeleteFile = () => {
    setShowDeleteDialog(true);
  };

  const confirmRemoveFromKnowledgeBase = async () => {
    if (!knowledgeBaseInfo?.id || !file?.id) return;

    try {
      await removeFromKBMutation.mutateAsync({
        knowledgeBaseId: knowledgeBaseInfo.id,
        fileId: file.id,
      });
      if (onRemoveFromKnowledgeBase) {
        onRemoveFromKnowledgeBase();
      }
      setShowRemoveDialog(false);
    } catch (error) {
      console.error('Error removing file from knowledge base:', error);
    }
  };

  const confirmDeleteFile = async () => {
    try {
      await deleteFileMutation.mutateAsync({ id: file.id });
      if (onDeleteFile) {
        onDeleteFile();
      } else {
        onDelete();
      }
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
        className={`group flex min-h-[100px] min-w-[200px] cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 sm:min-h-[110px] sm:min-w-[220px] dark:hover:shadow-gray-900/50 ${className}`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between p-2 pb-1 sm:p-3 sm:pb-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md sm:h-7 sm:w-7 ${color}`}
            >
              <IconComponent className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
                  className="h-5 w-5 p-0 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 sm:h-6 sm:w-6 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-label="More options" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px] p-1 sm:w-[272px]" align="end">
                {/* View Section */}
                <DropdownMenuItem
                  onClick={handleViewDetails}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                >
                  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-blue-100 sm:h-5 sm:w-5 dark:bg-blue-900/30">
                    <Eye className="h-2.5 w-2.5 text-blue-600 sm:h-3 sm:w-3 dark:text-blue-400" />
                  </div>
                  <span className="truncate">View Details</span>
                </DropdownMenuItem>

                {/* Download Section */}
                <DropdownMenuItem
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                >
                  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-green-100 sm:h-5 sm:w-5 dark:bg-green-900/30">
                    <Download className="h-2.5 w-2.5 text-green-600 sm:h-3 sm:w-3 dark:text-green-400" />
                  </div>
                  <span className="truncate">{isDownloading ? 'Downloading...' : 'Download'}</span>
                </DropdownMenuItem>

                {showKnowledgeBaseOptions ? (
                  <>
                    {/* Separator */}
                    <div className="-mx-1 my-1 border-t border-gray-200 dark:border-gray-700" />

                    {/* Remove from Knowledge Base Section */}
                    <DropdownMenuItem
                      onClick={handleRemoveFromKnowledgeBase}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-700 dark:text-gray-200 dark:hover:bg-orange-900/20 dark:hover:text-orange-300"
                    >
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-orange-100 sm:h-5 sm:w-5 dark:bg-orange-900/30">
                        <Unlink className="h-2.5 w-2.5 text-orange-600 sm:h-3 sm:w-3 dark:text-orange-400" />
                      </div>
                      <span className="truncate">Remove from Knowledge Base</span>
                    </DropdownMenuItem>

                    {/* Delete File Section */}
                    <DropdownMenuItem
                      onClick={handleDeleteFile}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-700 transition-colors duration-200 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-red-100 sm:h-5 sm:w-5 dark:bg-red-900/30">
                        <Trash2 className="h-2.5 w-2.5 text-red-600 sm:h-3 sm:w-3 dark:text-red-400" />
                      </div>
                      <span className="truncate">Delete File</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {/* Separator */}
                    <div className="-mx-1 my-1 border-t border-gray-200 dark:border-gray-700" />

                    {/* Delete Section */}
                    <DropdownMenuItem
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-700 transition-colors duration-200 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-red-100 sm:h-5 sm:w-5 dark:bg-red-900/30">
                        <Trash2 className="h-2.5 w-2.5 text-red-600 sm:h-3 sm:w-3 dark:text-red-400" />
                      </div>
                      <span className="truncate">Delete File</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-2 pb-1 sm:px-3 sm:pb-2">
          <p className="flex-1 break-words text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {formatMimeType(file.mimeType)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 px-2 py-1.5 sm:px-3 sm:py-2 dark:border-gray-800">
          <div className="flex items-center gap-1 text-xs text-gray-500 sm:gap-1.5 dark:text-gray-400">
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span>{formatFileSize(file.size)}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {allPersonas.length > 0 && (
              <div className="flex -space-x-0.5 sm:-space-x-1">
                {allPersonas.slice(0, 3).map((persona: any) => (
                  <Avatar
                    key={persona.id}
                    src={persona.logo}
                    alt={`${persona.name} avatar`}
                    fallback={persona.name}
                    size="sm"
                    className="h-3 w-3 border border-white sm:h-4 sm:w-4 dark:border-gray-800"
                  />
                ))}
                {allPersonas.length > 3 && (
                  <div className="flex h-3 w-3 items-center justify-center rounded-full border border-white bg-gray-200 text-xs font-medium text-gray-600 sm:h-4 sm:w-4 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
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
        onDownload={handleDownload}
        isDownloading={isDownloading}
        knowledgeBaseInfo={knowledgeBaseInfo}
        onRemoveFromKnowledgeBase={onRemoveFromKnowledgeBase}
        onDeleteFile={onDeleteFile}
        showKnowledgeBaseOptions={showKnowledgeBaseOptions}
      />

      {/* Remove from Knowledge Base Confirmation Dialog */}
      <DeleteDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={confirmRemoveFromKnowledgeBase}
        title="Remove from Knowledge Base"
        description={`Are you sure you want to remove "${file?.originalName}" from this knowledge base? This will remove it from the vector database but keep the file in your storage.`}
        confirmText="Remove from Knowledge Base"
        isLoading={removeFromKBMutation.isPending}
      />

      {/* Delete File Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description={`Are you sure you want to permanently delete "${file?.originalName}"? This will delete the file from the knowledge base, vector database, and storage. This action cannot be undone.`}
        confirmText="Delete File"
        isLoading={deleteFileMutation.isPending}
      />
    </>
  );
}
