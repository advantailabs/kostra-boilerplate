'use client';

import { RiSortAsc, RiSortDesc } from '@remixicon/react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Dialog, DialogContent, DialogHeader } from '@/components/molecules/common/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { usePersonas } from '@/hooks/usePersonas';
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

  // Fetch knowledge bases for the filter
  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const knowledgeBases = knowledgeBasesData?.knowledgeBases || [];

  // Fetch personas for the filter
  const { personas, isLoading: loadingPersonas } = usePersonas();

  const handleSearch = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setLocalFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder }));
  };

  const handleFilter = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleKnowledgeBaseFilter = (value: string) => {
    const knowledgeBaseId = value === 'all' ? undefined : parseInt(value, 10);
    setLocalFilters(prev => ({ ...prev, knowledgeBaseId }));
  };

  const handlePersonaFilter = (value: string) => {
    const personaId = value === 'all' ? undefined : parseInt(value, 10);
    setLocalFilters(prev => ({ ...prev, personaId }));
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Filter Files</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Set filters to find the files you need
          </p>
        </DialogHeader>

        <div className="px-4 pt-4">
          {/* Search - Full Width */}
          <div className="mb-4">
            <label
              htmlFor="search-files"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
              {/* Knowledge Base Filter */}
              <div>
                <label
                  htmlFor="knowledge-base-filter"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Knowledge Base
                </label>
                {loadingKnowledgeBases ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span>Loading knowledge bases...</span>
                  </div>
                ) : (
                  <Select
                    value={localFilters.knowledgeBaseId?.toString() || 'all'}
                    onValueChange={handleKnowledgeBaseFilter}
                    aria-label="Select knowledge base"
                  >
                    <SelectTrigger id="knowledge-base-filter">
                      <SelectValue placeholder="All Knowledge Bases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Knowledge Bases</SelectItem>
                      {knowledgeBases.map(kb => (
                        <SelectItem key={kb.id} value={kb.id.toString()}>
                          {kb.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Persona Filter */}
              <div>
                <label
                  htmlFor="persona-filter"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Persona
                </label>
                {loadingPersonas ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span>Loading personas...</span>
                  </div>
                ) : (
                  <Select
                    value={localFilters.personaId?.toString() || 'all'}
                    onValueChange={handlePersonaFilter}
                    aria-label="Select persona"
                  >
                    <SelectTrigger id="persona-filter">
                      <SelectValue placeholder="All Personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Personas</SelectItem>
                      {personas.map(persona => (
                        <SelectItem key={persona.id} value={persona.id.toString()}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* File Type Filter */}
              <div>
                <label
                  htmlFor="file-type-filter"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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
                <label
                  htmlFor="sort-by-filter"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sort By
                </label>
                <Select
                  value={localFilters.sortBy || 'createdAt'}
                  onValueChange={value => handleSort(value, localFilters.sortOrder || 'desc')}
                  aria-label="Select sort by"
                >
                  <SelectTrigger id="sort-by-filter">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="mimeType">Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="sort-order-button"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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

          <div className="-mx-4 border-t border-gray-200 dark:border-gray-700" />

          {/* Action Buttons */}
          <div className="flex gap-3 py-4">
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
