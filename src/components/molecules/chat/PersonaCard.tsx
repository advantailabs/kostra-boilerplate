import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Card } from '@/components/atom/Card';
import { S3_BASE_URL } from '@/lib/s3';
import { Persona } from '@prisma/client';
import { RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import Image from 'next/image';

interface PersonaCardProps {
  persona: Persona;
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
  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg ${className} ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex-shrink-0">
            {persona.logo ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={`${S3_BASE_URL}/${persona.logo}`}
                  alt={`${persona.name} logo`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                <span className="text-lg font-semibold text-white">
                  {persona.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {persona.name}
            </h3>

            {persona.tags && persona.tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {persona.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="neutral"
                    className="bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {persona.tags.length > 3 && (
                  <Badge
                    variant="neutral"
                    className="bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    +{persona.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="ml-3 flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <RiEditLine className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 w-8 p-0 text-red-600 opacity-60 transition-opacity hover:text-red-700 hover:opacity-100 dark:text-red-400 dark:hover:text-red-300"
            >
              <RiDeleteBinLine className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
