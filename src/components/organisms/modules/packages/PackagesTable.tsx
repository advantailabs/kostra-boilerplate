'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { DataTable } from '@/components/ui/data-table';
import { usePackages } from '@/hooks/usePackages';

import {
  packageTableColumns,
  type PackageTableRow,
} from './packageTableColumns';

interface PackagesTableProps {
  onEdit: (_package: PackageTableRow) => void;
  onDelete: (_packageId: number, _packageTitle: string) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  className?: string;
}

export function PackagesTable({
  onEdit,
  onDelete,
  onAdd,
  onPageChange,
  className,
}: PackagesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    {}
  );

  const { packages, pagination, isLoading } = usePackages({
    page,
    limit,
    title: debouncedSearch,
  });

  const total = pagination?.totalCount || 0;
  const totalPages = pagination?.totalPages || 1;

  // Handle smart pagination after deletion
  if (packages.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
    setPage((prevPage) => prevPage - 1);
  }

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  return (
    <div className={`min-h-screen ${className || ''}`}>
      <PageHeaderWithAction
        title="Packages"
        description="Manage subscription packages"
        onAdd={onAdd}
        addButtonText="New Package"
      />

      <div className="h-full p-4 space-y-4 max-sm:p-3">
        <UnifiedSearchBar
          placeholder="Search by title..."
          value={searchInput}
          onChange={setSearchInput}
          className=""
        />

        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background  before:pointer-events-none before:inset-0 before:rounded-md">
          <DataTable<PackageTableRow, unknown>
            columns={packageTableColumns}
            data={packages}
            meta={{ onEdit, onDelete }}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            emptyMessage="No packages found."
            isLoading={isLoading || searchInput !== debouncedSearch}
            loadingMessage={
              searchInput !== debouncedSearch
                ? 'Searching...'
                : 'Loading packages...'
            }
          />
        </div>

        {packages.length > 0 && (
          <Pagination
            pagination={{
              page,
              limit,
              totalCount: total,
              totalPages,
            }}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
