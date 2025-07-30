'use client';

import { Calendar, Database, Download, FileText, HardDrive, Info, Users, X } from 'lucide-react';

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
  onRemoveFromKnowledgeBase?: () => void;
  onDeleteFile?: () => void;
  showKnowledgeBaseOptions?: boolean;
}

export function FileDetailsModal({
  isOpen,
  onClose,
  file,
  onDownload,
  isDownloading = false,
  knowledgeBaseInfo,
}: FileDetailsModalProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

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
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return { icon: FileText, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' };
    }
    if (mimeType.startsWith('image/')) {
      return {
        icon: FileText,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      };
    }
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      return { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
    }
    if (mimeType === 'application/json') {
      return {
        icon: FileText,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      };
    }
    return { icon: FileText, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' };
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  if (!file) return null;

  // Extract knowledge bases from file data or use provided knowledge base info
  let knowledgeBases: any[] = [];

  if (knowledgeBaseInfo) {
    // If knowledge base info is provided directly (from knowledge base detail page)
    knowledgeBases = [knowledgeBaseInfo];
  } else if (file.fileKnowledgeBases) {
    // If file has fileKnowledgeBases property (from files page)
    knowledgeBases = file.fileKnowledgeBases?.map((fkb: any) => fkb.knowledgeBase) || [];
  }

  const { icon: FileIcon, color: iconColor, bgColor: iconBgColor } = getFileTypeIcon(file.mimeType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <div className={`rounded-lg p-2 ${iconBgColor}`}>
                <FileIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {file.originalName}
                </h3>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{file.mimeType}</p>
              </div>
            </DialogTitle>
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 px-6 py-6">
          {/* File Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">File Size</span>
              </div>
              <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded</span>
              </div>
              <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(file.createdAt)}
              </p>
            </div>
          </div>

          {/* Knowledge Bases Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Knowledge Bases ({knowledgeBases.length})
              </h4>
            </div>

            {knowledgeBases.length > 0 ? (
              <div className="space-y-3">
                {knowledgeBases.map((kb: any) => (
                  <div
                    key={kb.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {kb.title}
                        </h5>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {kb.description}
                        </p>
                      </div>

                      {/* Personas using this knowledge base */}
                      {kb.personas && kb.personas.length > 0 && (
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Used by {kb.personas.length} persona
                              {kb.personas.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {kb.personas.map((persona: any) => (
                              <Badge
                                key={persona.id}
                                variant="neutral"
                                className="flex items-center gap-1.5 px-2 py-1 text-xs"
                              >
                                <Avatar
                                  src={persona.logo}
                                  alt={`${persona.name} avatar`}
                                  fallback={persona.name}
                                  size="sm"
                                  className="h-3 w-3"
                                />
                                <span className="max-w-20 truncate">{persona.name}</span>
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
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <Info className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This file is not associated with any knowledge bases.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
