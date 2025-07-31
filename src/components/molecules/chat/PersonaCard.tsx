import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { getPersonaFileInfo } from '@/hooks/usePersonas';
import { getFileTypeCategoryIcon } from '@/lib/file-utils';
import { PersonaWithKnowledgeBase } from '@/types/chat';
import { Edit, FileText, Trash2 } from 'lucide-react';

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

  return (
    <Card
      className={`group flex h-[160px] w-full cursor-pointer flex-col transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 sm:h-[180px] dark:hover:shadow-gray-900/50 ${className} ${
        isSelected ? 'ring-primary ring-2 ring-offset-2' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-start justify-between p-3 pb-2 sm:p-4 sm:pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Avatar
            src={persona.logo}
            alt={`${persona.name} avatar`}
            fallback={persona.name}
            size="md"
            className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold leading-tight text-gray-900 sm:text-base dark:text-gray-100">
              {persona.name}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ml-1 flex flex-shrink-0 items-center gap-0.5 sm:ml-2 sm:gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:h-7 sm:w-7 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-label="Edit persona" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-6 w-6 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600 sm:h-7 sm:w-7 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-label="Delete persona" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3 pb-2 sm:px-4 sm:pb-3">
        <p className="flex-1 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-400">
          {persona.description && persona.description.length > 50
            ? `${persona.description.substring(0, 50)}...`
            : persona.description ||
              'You are a professional assistant specialized in content creation, strategies, and optimization. I help users with their tasks efficiently and effectively.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 px-3 py-2 sm:px-4 sm:py-3 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 sm:gap-2 dark:text-gray-400">
          <FileText className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" />
          <span>{fileCount} files</span>
        </div>
        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          {fileTypes.slice(0, 3).map((type, index) => {
            const { icon: IconComponent, color } = getFileTypeCategoryIcon(type);
            return (
              <div
                key={index}
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium sm:h-5 sm:w-5 ${color}`}
              >
                <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </div>
            );
          })}
          {fileTypes.length > 3 && (
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white sm:h-5 sm:w-5">
              +{fileTypes.length - 3}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
