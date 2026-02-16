'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { DataTable } from '@/components/ui/data-table';
import { EmailTemplate } from '@/services/api/email-templates';
import { Pagination } from '../../../molecules/common/Pagination';
import { UnifiedSearchBar } from '../../../molecules/common/UnifiedSearchBar';

import { Field, FieldLabel } from '@/components/ui/field';
import { emailTemplateTableColumns } from './emailTemplatesTableColumns';

type EmailTemplateTypeOption = {
  value: 'ALL' | 'TRANSACTIONAL' | 'PROMOTIONAL';
  label: string;
};
const TYPE_OPTIONS: EmailTemplateTypeOption[] = [
  { value: 'ALL', label: 'All Types' },
  { value: 'TRANSACTIONAL', label: 'Transactional' },
  { value: 'PROMOTIONAL', label: 'Promotional' },
];

interface EmailTemplatesTableProps {
  onEdit: (_template: EmailTemplate) => void;
  onDelete: (_templateId: number, _templateName: string) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  templates: EmailTemplate[];
  isLoading?: boolean;
  className?: string;
}

export function EmailTemplatesTable({
  onEdit,
  onDelete,
  onAdd,
  onPageChange,
  templates,
  isLoading = false,
  className,
}: EmailTemplatesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [filterType, setFilterType] = useState<'ALL' | 'TRANSACTIONAL' | 'PROMOTIONAL'>('ALL');

  // Filter templates based on search and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesType = filterType === 'ALL' || template.emailType === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination
  const total = filteredTemplates.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);


  // Handle smart pagination after deletion
  if (paginatedTemplates.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
    setPage(prev => Math.max(1, prev - 1));
  }

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  return (
    <div className={`min-h-screen  ${className || ''}`}>
      <PageHeaderWithAction
        title="Email Templates"
        description="Manage your reusable email templates"
        onAdd={onAdd}
        addButtonText="New Template"
      />
      <div className="h-full space-y-4 p-4 max-sm:p-3">
        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UnifiedSearchBar
            placeholder="Search by title..."
            value={searchInput}
            onChange={setSearchInput}
            className="flex-1"
          />

          <Field className="flex flex-row items-center gap-2 w-40">
            <FieldLabel htmlFor="type-filter" className="w-auto!">Type:</FieldLabel>
            <Combobox
              items={TYPE_OPTIONS}
              value={TYPE_OPTIONS.find((o) => o.value === filterType) ?? TYPE_OPTIONS[0]}
              onValueChange={(item) => setFilterType(item?.value ?? 'ALL')}
              itemToStringValue={(item) => item.label}
            >
              <ComboboxInput placeholder="All Types" className="bg-background " />
              <ComboboxContent>
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
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background">
          <DataTable<EmailTemplate, unknown>
            columns={emailTemplateTableColumns}
            data={paginatedTemplates}
            meta={{ onEdit, onDelete }}
            emptyMessage="No email templates found."
            isLoading={isLoading || searchInput !== debouncedSearch}
            loadingMessage={
              searchInput !== debouncedSearch
                ? 'Searching...'
                : 'Loading email templates...'
            }
          />
        </div>

        {/* Pagination */}
        {paginatedTemplates.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            {/* <div className="text-sm text-gray-500 ">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
            </div> */}
            <Pagination
              pagination={{
                page,
                limit,
                totalCount: total,
                totalPages,
              }}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
