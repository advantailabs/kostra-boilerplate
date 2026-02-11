import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Filter, Plus } from 'lucide-react';
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
    <header
      className={`flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background/40 backdrop-blur-md rounded-t-xl ${className || ''}`}
    >
      <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0">
          <h1 className="text-lg font-medium text-text truncate">{title}</h1>
          {!description && <p className="text-xs text-text-muted truncate">{description}</p>}
        </div>
      </div>
      {(onAdd || onFilter || actions) && (
        <div className="flex items-center gap-3 px-4 shrink-0">
          {onFilter && (
            <Button
              onClick={onFilter}
              variant="secondary"
              className={`flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-primary' : ''}`}
            >
              <Filter className="h-4 w-4" />
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
              <Plus className="h-4 w-4" /> {addButtonText}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
