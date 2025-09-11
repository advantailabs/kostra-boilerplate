'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { RiAddLine, RiArrowDownSLine, RiEyeLine } from '@remixicon/react';
import { useState } from 'react';

interface FilterBarProps {
  onAdd?: () => void;
  onView?: () => void;
  onFilterChange?: (_column: string, _value: any) => void;
  searchValue?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function FilterBar({
  onAdd,
  onView,
  onFilterChange,
  searchValue = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: FilterBarProps) {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'slug', label: 'Slug' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Updated' },
  ];

  const handleSortByChange = (newSortBy: string) => {
    onFilterChange?.('sortBy', newSortBy);
    setIsSortDropdownOpen(false);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange?.('sortOrder', newOrder);
  };

  const currentSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[1];

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

          {/* Sort button */}
          <div className="relative z-50">
            <Button
              variant="secondary"
              className="flex items-center gap-2 px-3 py-2 text-sm"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <span>Sort</span>
              <RiArrowDownSLine className="h-4 w-4" />
            </Button>

            {/* Sort dropdown */}
            {isSortDropdownOpen && (
              <div
                className="absolute left-0 top-full z-[9999] mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                style={{ position: 'absolute' }}
              >
                <div className="py-1">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortByChange(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        option.value === sortBy
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

      {/* Overlay to close dropdown when clicking outside */}
      {isSortDropdownOpen && (
        <div className="fixed inset-0 z-[9996]" onClick={() => setIsSortDropdownOpen(false)} />
      )}
    </div>
  );
}
