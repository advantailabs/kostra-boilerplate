'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
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

  // Show loading screen only on initial load, not during search
  if (isLoading && !searchInput) {
    return <LoadingScreen message="Loading packages..." />;
  }

  const isSearching =
    isLoading && searchInput !== debouncedSearch;

  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <PageHeaderWithAction
        title="Packages"
        description="Manage subscription packages"
        onAdd={onAdd}
        addButtonText="New Package"
      />

      <div className="h-full p-4 max-sm:p-3">
        <UnifiedSearchBar
          placeholder="Search by title..."
          value={searchInput}
          onChange={setSearchInput}
          className="mb-2"
        />

        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <DataTable<PackageTableRow, unknown>
            columns={packageTableColumns}
            data={packages}
            meta={{ onEdit, onDelete }}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            emptyMessage="No packages found."
            isLoading={isSearching}
            loadingMessage="Searching..."
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
