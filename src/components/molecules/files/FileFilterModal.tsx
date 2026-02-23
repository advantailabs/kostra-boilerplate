'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';

import { Modal } from '@/components/molecules/common/Modal';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FileFilters } from '@/services/api/files';

interface FileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FileFilters;
  onFiltersChange: (_filters: FileFilters) => void;
}

const FILE_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'text/plain', label: 'Text' },
  { value: 'application/json', label: 'JSON' },
  { value: 'text/markdown', label: 'Markdown' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
];

const SORT_BY_OPTIONS: { value: FileFilters['sortBy']; label: string }[] = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'originalName', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'mimeType', label: 'Type' },
];

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
      maxWidth="max-w-2xl!"
      contentClassName="max-h-[90vh] overflow-y-auto"
      footer={customFooter}
    >
      {/* Search - Full Width */}
      <div className="mb-4">
        <Field>
          <FieldLabel htmlFor="search-files">Search Files</FieldLabel>
          <Input
            id="search-files"
            type="text"
            placeholder="Search files by name..."
            value={localFilters.search || ''}
            onChange={e => handleSearch(e.target.value)}
          />
        </Field>
      </div>

      {/* Two Column Layout for Filters */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* File Type Filter */}
          <Field>
            <FieldLabel htmlFor="file-type-filter">File Type</FieldLabel>
            <Combobox
              id='file-type-filter'
              items={FILE_TYPE_OPTIONS}
              value={FILE_TYPE_OPTIONS.find(
                (o) => o.value === (localFilters.mimeType ?? 'all')
              )}
              onValueChange={(item) => {
                console.log(item)
                setLocalFilters(prev => {
                  const next = { ...prev, mimeType: item?.value }
                  console.log(next)
                  return next
                })
              }}
              itemToStringValue={(item) => item.label}
            >
              <ComboboxInput placeholder="Select a file type" />

              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>

                <ComboboxList>
                  {(item) => (
                    <ComboboxItem
                      key={item.value}
                      value={item}
                    >
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Sort Options */}
          <Field>
            <FieldLabel htmlFor="sort-by-filter">Sort By</FieldLabel>
            <Combobox
              id="sort-by-filter"
              items={SORT_BY_OPTIONS}
              value={SORT_BY_OPTIONS.find(
                (o) => o.value === (localFilters.sortBy ?? 'createdAt')
              )}
              onValueChange={(item) => {
                if (item?.value) {
                  handleSort(item.value, localFilters.sortOrder ?? 'desc');
                }
              }}
              itemToStringValue={(item) => item.label}
            >
              <ComboboxInput placeholder="Sort by" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel htmlFor="sort-order-button">Sort Order</FieldLabel>
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
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {localFilters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Field>
        </div>
      </div>
    </Modal>
  );
}
