import { Button } from '@/components/atom/Button';
import { RiAddLine } from '@remixicon/react';

interface PageHeaderWithActionProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export function PageHeaderWithAction({
  title,
  description,
  onAdd,
  addButtonText = 'New',
  className,
}: PageHeaderWithActionProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700 ${className || ''}`}
    >
      <div className="relative min-w-0 flex-1 border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="min-w-0">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h1>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      {onAdd && (
        <div className="px-4 py-3 max-sm:px-4 max-sm:py-3">
          <Button
            onClick={onAdd}
            className="max-sm:w-auto max-sm:justify-center max-sm:px-3 max-sm:py-2"
          >
            <RiAddLine className="h-4 w-4" /> {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
