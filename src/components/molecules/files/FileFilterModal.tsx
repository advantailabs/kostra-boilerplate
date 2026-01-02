'use client';

import { RiSortAsc, RiSortDesc } from '@remixicon/react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Modal } from '@/components/molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { FileFilters } from '@/services/api/files';

interface FileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FileFilters;
  onFiltersChange: (_filters: FileFilters) => void;
}

export function FileFilterModal({
  isOpen,
  onClose,
  filters: _filters,
  onFiltersChange,
}: FileFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FileFilters>(_filters);

  const handleSearch = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleSort = (sortBy: FileFilters["sortBy"]
    , sortOrder: FileFilters["sortOrder"]) => {
    setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handleFilter = (key: keyof FileFilters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FileFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  // Custom footer with reset and apply buttons
  const customFooter = (
    <div className="flex w-full gap-3">
      <Button variant="secondary" onClick={handleReset} className="flex-1">
        Reset
      </Button>
      <Button onClick={handleApply} className="flex-1">
        Apply Filters
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Files"
      description="Set filters to find the files you need"
      maxWidth="max-w-2xl"
      contentClassName="max-h-[90vh] overflow-y-auto"
      footer={customFooter}
    >
      {/* Search - Full Width */}
      <div className="mb-4">
        <label htmlFor="search-files" className="mb-2 block text-sm font-medium text-text">
          Search Files
        </label>
        <Input
          id="search-files"
          type="text"
          placeholder="Search files by name..."
          value={localFilters.search || ''}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {/* Two Column Layout for Filters */}
      <div className="mb-4 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* File Type Filter */}
          <div>
            <label htmlFor="file-type-filter" className="mb-2 block text-sm font-medium text-text">
              File Type
            </label>
            <Select
              value={localFilters.mimeType || 'all'}
              onValueChange={value => handleFilter('mimeType', value === 'all' ? '' : value)}
              aria-label="Select file type"
            >
              <SelectTrigger id="file-type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="application/pdf">PDF</SelectItem>
                <SelectItem value="text/plain">Text</SelectItem>
                <SelectItem value="application/json">JSON</SelectItem>
                <SelectItem value="text/markdown">Markdown</SelectItem>
                <SelectItem value="image/jpeg">JPEG</SelectItem>
                <SelectItem value="image/png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Sort Options */}
          <div>
            <label htmlFor="sort-by-filter" className="mb-2 block text-sm font-medium text-text">
              Sort By
            </label>
            <Select
              value={localFilters.sortBy || 'createdAt'}
              onValueChange={value => handleSort(value as FileFilters["sortBy"], localFilters.sortOrder || 'desc')}
              aria-label="Select sort by"
            >
              <SelectTrigger id="sort-by-filter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="originalName">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="mimeType">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="sort-order-button" className="mb-2 block text-sm font-medium text-text">
              Sort Order
            </label>
            <Button
              id="sort-order-button"
              variant="secondary"
              onClick={() =>
                handleSort(
                  localFilters.sortBy || 'createdAt',
                  localFilters.sortOrder === 'asc' ? 'desc' : 'asc'
                )
              }
              className="flex w-full items-center justify-center gap-2"
            >
              {localFilters.sortOrder === 'asc' ? (
                <RiSortAsc className="h-4 w-4" />
              ) : (
                <RiSortDesc className="h-4 w-4" />
              )}
              {localFilters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
