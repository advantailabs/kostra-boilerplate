'use client';

import { Calendar, Database, HardDrive, Info, Users } from 'lucide-react';

import { Avatar } from '@/components/atom/Avatar';
import { Badge } from '@/components/atom/Badge';
import { Modal } from '@/components/molecules/common/Modal';
import { formatFileSize } from '@/lib/file-utils';

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
}

export function FileDetailsModal({
  isOpen,
  onClose,
  file,
  onDownload,
  isDownloading = false,
  knowledgeBaseInfo,
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
    } catch (error) {
      return 'Invalid Date';
    }
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

  // Icon destructuring removed as it was only used in commented customHeaderContent
  // const {
  //   icon: FileIcon,
  //   textColor: iconColor,
  //   bgColor: iconBgColor,
  // } = getFileTypeIconWithColor(file.mimeType);

  // Custom header content for the modal (currently unused but preserved for future use)
  // const customHeaderContent = (
  //   <div className="flex items-center gap-3">
  //     <div className={`rounded-lg p-2 ${iconBgColor}`}>
  //       <FileIcon className={`h-5 w-5 ${iconColor}`} />
  //     </div>
  //     <div className="min-w-0 flex-1">
  //       <h3 className="truncate text-lg font-medium text-gray-900 dark:text-gray-100">
  //         {file.originalName}
  //       </h3>
  //       <p className="truncate text-xs text-gray-500 dark:text-gray-400">{file.mimeType}</p>
  //     </div>
  //   </div>
  // );

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
    </Modal>
  );
}
