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
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-x-auto overflow-y-visible">
          {/* Search bar */}
          <div className="h-8 min-w-[200px]">
            <Input
              placeholder="Search by title..."
              value={searchValue}
              onChange={e => onFilterChange?.('title', e.target.value)}
              className="h-full"
              inputClassName="h-full py-0"
            />
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {onAdd && (
            <Button variant="primary" className="flex h-8 gap-x-2 px-2 text-sm" onClick={onAdd}>
              <RiAddLine className="h-4 w-4" />
              New
            </Button>
          )}
          {onView && (
            <Button variant="secondary" className="flex h-8 gap-x-2 px-2 text-sm" onClick={onView}>
              <RiEyeLine className="h-4 w-4" />
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
