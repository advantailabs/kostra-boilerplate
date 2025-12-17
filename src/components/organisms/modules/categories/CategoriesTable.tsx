'use client';

import { RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { Table, TableBody, TableCell, TableRow } from '@/components/molecules/common/Table';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { useCategories } from '@/hooks/useCategories';

interface CategoriesTableProps {
  onEdit: (_category: { id: number; name: string; slug: string }) => void;
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
  useEffect(() => {
    // If current page is empty and we're not on page 1, go to previous page
    if (categories.length === 0 && page > 1 && !isLoading && totalPages > 1) {
      setPage(page - 1);
    }
  }, [categories.length, page, isLoading, totalPages]);

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

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={4} className="h-24 text-center !text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-text-muted">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={4} className="h-24 text-center !text-text-muted">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map(category => (
                  <TableRow
                    key={category.id}
                    className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background"
                    onClick={() =>
                      onEdit({ id: category.id, name: category.name, slug: category.slug })
                    }
                  >
                    <TableCell className="py-1 text-text">
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-text">
                          {category.name || 'Unnamed Category'}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {category.slug || 'No slug'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      {/* eslint-disable-next-line no-underscore-dangle */}
                      <Badge variant="neutral">{category._count?.blogs || 0} blogs</Badge>
                    </TableCell>
                    <TableCell className="py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Last Modified:</div>
                      <div className="text-sm text-text-muted">
                        {category.updatedAt && !Number.isNaN(new Date(category.updatedAt).getTime())
                          ? new Date(category.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            onEdit({ id: category.id, name: category.name, slug: category.slug });
                          }}
                          className="group size-8 hover:border hover:border-border hover:bg-background"
                        >
                          <RiEditLine size={14} className="shrink-0" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            onDelete(category.id, category.name);
                          }}
                          className="group size-8 hover:border hover:border-border hover:bg-background"
                        >
                          <RiDeleteBinLine size={14} className="shrink-0 text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
