'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { RiAddLine, RiEyeLine } from '@remixicon/react';

interface FilterBarProps {
  onAdd?: () => void;
  onView?: () => void;
  onFilterChange?: (_column: string, _value: any) => void;
  searchValue?: string;
}

export function FilterBar({ onAdd, onView, onFilterChange, searchValue = '' }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3 overflow-x-auto">
          {/* Search bar with icon inside */}
          <div className="min-w-[200px]">
            <Input
              type="search"
              placeholder="Search by name..."
              value={searchValue}
              onChange={e => onFilterChange?.('name', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAdd && (
            <Button
              variant="primary"
              className="flex items-center gap-2 px-3 py-2 text-sm"
              onClick={onAdd}
            >
              <RiAddLine className="h-4 w-4" />
              New
            </Button>
          )}
          {onView && (
            <Button
              variant="secondary"
              className="flex items-center gap-2 px-3 py-2 text-sm"
              onClick={onView}
            >
              <RiEyeLine className="h-4 w-4" />
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
