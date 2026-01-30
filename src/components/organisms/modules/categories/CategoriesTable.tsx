'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { DataTable } from '@/components/ui/data-table';
import { useCategories } from '@/hooks/useCategories';

import {
  categoryTableColumns,
  type CategoryTableRow,
} from './categoriesTableColumns';

interface CategoriesTableProps {
  onEdit: (_category: CategoryTableRow) => void;
  onDelete: (_categoryId: number, _categoryName: string) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  className?: string;
}

export function CategoriesTable({
  onEdit,
  onDelete,
  onAdd,
  onPageChange,
  className,
}: CategoriesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);

  const { categories, pagination, isLoading } = useCategories({
    page,
    limit,
    name: debouncedSearch,
  });

  const total = pagination?.totalCount || 0;
  const totalPages = pagination?.totalPages || 1;

  // React Query will fetch when queryKey changes (debouncedSearch/page)

  // Handle smart pagination after deletion
  // If current page is empty and we're not on page 1, go to previous page
  if (categories.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
    setPage(prevPage => prevPage - 1);
  }

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  // Show loading screen only on initial load, not during search
  if (isLoading && !searchInput) {
    return <LoadingScreen message="Loading categories..." />;
  }

  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <PageHeaderWithAction
        title="Categories"
        description="Manage blog categories"
        onAdd={onAdd}
        addButtonText="New"
      />

      <div className="h-full p-4 max-sm:p-3">
        <UnifiedSearchBar
          placeholder="Search by name or slug..."
          value={searchInput}
          onChange={setSearchInput}
          className="mb-2"
        />

        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <DataTable<CategoryTableRow, unknown>
            columns={categoryTableColumns}
            data={categories}
            meta={{ onEdit, onDelete }}
            emptyMessage="No categories found."
            isLoading={isLoading && searchInput !== debouncedSearch}
            loadingMessage="Searching..."
          />
        </div>

        {/* Pagination */}
        {categories.length > 0 && (
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
