import { Button } from '@/components/atom/Button';
import { RiAddLine, RiFilterLine } from '@remixicon/react';
import { ReactNode } from 'react';

interface PageHeaderWithActionProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addButtonText?: string;
  onFilter?: () => void;
  hasActiveFilters?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PageHeaderWithAction({
  title,
  description,
  onAdd,
  addButtonText = 'New',
  onFilter,
  hasActiveFilters = false,
  actions,
  className,
}: PageHeaderWithActionProps) {
  return (
    <div className={`flex items-center justify-between border-b border-border ${className || ''}`}>
      <div className="relative min-w-0 flex-1 border-border px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-medium text-text">{title}</h1>
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      {(onAdd || onFilter || actions) && (
        <div className="px-4 py-3 max-sm:px-4 max-sm:py-3">
          <div className="flex items-center gap-3">
            {onFilter && (
              <Button
                onClick={onFilter}
                variant="secondary"
                className={`flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-primary' : ''}`}
              >
                <RiFilterLine className="h-4 w-4" />
                Filter
                {hasActiveFilters && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
              </Button>
            )}
            {actions}
            {onAdd && (
              <Button
                onClick={onAdd}
                className="max-sm:w-auto max-sm:justify-center max-sm:px-3 max-sm:py-2"
              >
                <RiAddLine className="h-4 w-4" /> {addButtonText}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
