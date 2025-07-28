import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { getPersonaFileInfo } from '@/hooks/usePersonas';
import { PersonaWithKnowledgeBase } from '@/types/chat';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiFileExcelLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiFileWordLine,
  RiImageLine,
} from '@remixicon/react';

interface PersonaCardProps {
  persona: PersonaWithKnowledgeBase;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PersonaCard({
  persona,
  onEdit,
  onDelete,
  className,
  isSelected,
  onClick,
}: PersonaCardProps) {
  const { fileCount, fileTypes } = getPersonaFileInfo(persona);

  const fileTypeConfig = {
    PDF: {
      icon: RiFilePdfLine,
      color: 'bg-red-500 text-white',
    },
    Excel: {
      icon: RiFileExcelLine,
      color: 'bg-green-500 text-white',
    },
    Document: {
      icon: RiFileWordLine,
      color: 'bg-blue-500 text-white',
    },
    Image: {
      icon: RiImageLine,
      color: 'bg-purple-500 text-white',
    },
  };

  const getFileTypeIcon = (type: string) => {
    const config = fileTypeConfig[type as keyof typeof fileTypeConfig];
    if (!config) {
      return { icon: RiFileTextLine, color: 'bg-gray-500 text-white' };
    }
    return config;
  };

  return (
    <Card
      className={`group flex h-[180px] cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 ${className} ${
        isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-start justify-between p-4 pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar
            src={persona.logo}
            alt={`${persona.name} avatar`}
            fallback={persona.name}
            size="md"
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {persona.name}
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
                onEdit();
              }}
              className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <RiEditLine className="h-3.5 w-3.5" aria-label="Edit persona" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-7 w-7 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <RiDeleteBinLine className="h-3.5 w-3.5" aria-label="Delete persona" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-3">
        <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {persona.description && persona.description.length > 60
            ? `${persona.description.substring(0, 60)}...`
            : persona.description ||
              'You are a professional assistant specialized in content creation, strategies, and optimization. I help users with their tasks efficiently and effectively.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <RiFileTextLine className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{fileCount} files</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          {fileTypes.slice(0, 3).map((type, index) => {
            const { icon: IconComponent, color } = getFileTypeIcon(type);
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
  );
}
