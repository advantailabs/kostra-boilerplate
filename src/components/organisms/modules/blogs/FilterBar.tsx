'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiEyeLine,
} from '@remixicon/react';
import { useState } from 'react';

interface FilterBarProps {
  onAdd?: () => void;
  onView?: () => void;
  onFilterChange?: (_column: string, _value: any) => void;
  searchValue?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Date Created', value: 'createdAt' },
  { label: 'Last Updated', value: 'updatedAt' },
];

export function FilterBar({
  onAdd,
  onView,
  onFilterChange,
  searchValue = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: FilterBarProps) {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleSortByChange = (value: string) => {
    onFilterChange?.('sortBy', value);
    setIsSortDropdownOpen(false);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange?.('sortOrder', newOrder);
  };

  const currentSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[1];

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

          {/* Sort button */}
          <div className="relative">
            <Button
              variant="secondary"
              className="flex h-8 items-center gap-2 px-3 text-sm"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <span>Sort: {currentSortOption.label}</span>
              <RiArrowDownSLine className="h-4 w-4" />
            </Button>

            {/* Sort dropdown */}
            {isSortDropdownOpen && (
              <div className="absolute left-0 top-full z-[100] mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="py-1">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        option.value === sortBy
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => handleSortByChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort order toggle */}
          <Button
            variant="secondary"
            className="h-8 w-8 rounded-md border border-gray-300 p-0 shadow-sm dark:border-gray-800"
            onClick={handleSortOrderChange}
            aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
            title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            {sortOrder === 'asc' ? (
              <RiArrowUpLine className="h-4 w-4 text-gray-400 dark:text-white" />
            ) : (
              <RiArrowDownLine className="h-4 w-4 text-gray-400 dark:text-white" />
            )}
          </Button>
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

      {/* Overlay to close dropdown when clicking outside */}
      {isSortDropdownOpen && (
        <div className="fixed inset-0 z-[90]" onClick={() => setIsSortDropdownOpen(false)} />
      )}
    </div>
  );
}
