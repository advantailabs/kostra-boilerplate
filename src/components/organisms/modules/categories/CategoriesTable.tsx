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

  if (isLoading) {
    return <LoadingScreen message="Loading categories..." />;
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${className || ''}`}>
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
        <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-sm text-gray-500">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map(category => (
                  <TableRow
                    key={category.id}
                    className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900"
                  >
                    <TableCell className="py-1 text-gray-700 dark:text-gray-300">
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {category.name || 'Unnamed Category'}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {category.slug || 'No slug'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      {/* eslint-disable-next-line no-underscore-dangle */}
                      <Badge variant="neutral">{category._count?.blogs || 0} blogs</Badge>
                    </TableCell>
                    <TableCell className="py-1 text-gray-600 dark:text-gray-400">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Last Modified:</div>
                      <div className="text-sm">
                        {category.updatedAt && !Number.isNaN(new Date(category.updatedAt).getTime())
                          ? new Date(category.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            onEdit({ id: category.id, name: category.name, slug: category.slug })
                          }
                          className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                        >
                          <RiEditLine size={14} className="shrink-0" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(category.id, category.name)}
                          className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                        >
                          <RiDeleteBinLine
                            size={14}
                            className="shrink-0 text-red-600 dark:text-red-500"
                          />
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
