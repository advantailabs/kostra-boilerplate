import React from 'react';

import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { getFileTypeCategoryIcon } from '@/lib/file-utils';
import { KnowledgeBaseWithFiles } from '@/types/chat';
import { Edit, FileText, Trash2, User } from 'lucide-react';
import Link from 'next/link';

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBaseWithFiles;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function KnowledgeBaseCard({
  knowledgeBase,
  onEdit,
  onDelete,
  className,
  isSelected,
  onClick,
}: KnowledgeBaseCardProps) {
  const fileCount = knowledgeBase.fileKnowledgeBases?.length || 0;
  const personaCount = knowledgeBase.personas?.length || 0;

  // Extract unique file types from MIME types
  const fileTypes = Array.from(
    new Set(
      (knowledgeBase.fileKnowledgeBases || []).map(fileKb => {
        const mimeType = fileKb.file.mimeType.toLowerCase();
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
        if (mimeType.includes('image')) return 'Image';
        return 'Document'; // Default fallback
      })
    )
  );

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <Link href={`/app/knowledge-bases/${knowledgeBase.id}`} className="block min-w-0">
      <Card
        className={`group flex h-[180px] min-w-0 cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 ${className} ${
          isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
        }`}
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between p-4 pb-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar
              src={null}
              alt={`${knowledgeBase.title} avatar`}
              fallback={knowledgeBase.title.charAt(0).toUpperCase()}
              size="md"
              className="flex-shrink-0 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
                {knowledgeBase.title}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit();
                }}
                className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <Edit className="h-3.5 w-3.5" aria-label="Edit knowledge base" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete();
                }}
                className="h-7 w-7 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-label="Delete knowledge base" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-3">
          <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {knowledgeBase.description && knowledgeBase.description.length > 100
              ? `${knowledgeBase.description.substring(0, 100)}...`
              : knowledgeBase.description ||
                'A knowledge base for organizing and managing your files and documents.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{fileCount} files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{personaCount} personas</span>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            {fileTypes.slice(0, 3).map((type, index) => {
              const { icon: IconComponent, color } = getFileTypeCategoryIcon(type);
              return (
                <div
                  key={index}
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${color}`}
                >
                  <IconComponent className="h-3 w-3" />
                </div>
              );
            })}
            {fileTypes.length > 3 && (
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white">
                +{fileTypes.length - 3}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
