'use client';

import { RiCheckLine, RiCloseLine, RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { Table, TableBody, TableCell, TableRow } from '@/components/molecules/common/Table';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { usePackages } from '@/hooks/usePackages';

interface Package {
  id: number;
  title: string;
  description: string;
  isFeatured: boolean;
  price: number | string; // Can be number from API or Decimal string from DB
  currencySymbol: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface PackagesTableProps {
  onEdit: (_package: Package) => void;
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

  const { packages, pagination, isLoading } = usePackages({
    page,
    limit,
    title: debouncedSearch,
  });

  const total = pagination?.totalCount || 0;
  const totalPages = pagination?.totalPages || 1;

  // Handle smart pagination after deletion
  useEffect(() => {
    // If current page is empty and we're not on page 1, go to previous page
    if (packages.length === 0 && page > 1 && !isLoading && totalPages > 1) {
      setPage(page - 1);
    }
  }, [packages.length, page, isLoading, totalPages]);

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

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${className || ''}`}>
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

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-sm text-gray-500">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No packages found.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map(pkg => (
                  <TableRow
                    key={pkg.id}
                    className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900"
                  >
                    <TableCell className="py-1 text-gray-700 dark:text-gray-300">
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {pkg.title || 'Unnamed Package'}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {pkg.description || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {pkg.currencySymbol}
                        {typeof pkg.price === 'string'
                          ? parseFloat(pkg.price).toFixed(2)
                          : pkg.price.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      <Badge
                        variant={pkg.isFeatured ? 'primary' : 'neutral'}
                        className={`inline-flex items-center gap-1 font-medium ${!pkg.isFeatured ? 'opacity-50' : ''}`}
                      >
                        {pkg.isFeatured ? (
                          <RiCheckLine className="h-3 w-3" />
                        ) : (
                          <RiCloseLine className="h-3 w-3" />
                        )}
                        Featured
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1">
                      <Badge variant="neutral" className="text-xs">
                        {pkg.features.length} features
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 text-gray-600 dark:text-gray-400">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Last Modified:</div>
                      <div className="text-sm">
                        {pkg.updatedAt && !Number.isNaN(new Date(pkg.updatedAt).getTime())
                          ? new Date(pkg.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => onEdit(pkg)}
                          className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                        >
                          <RiEditLine size={14} className="shrink-0" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(pkg.id, pkg.title)}
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
