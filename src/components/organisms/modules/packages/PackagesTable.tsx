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
  // If current page is empty and we're not on page 1, go to previous page
  if (packages.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
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
    return <LoadingScreen message="Loading packages..." />;
  }

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

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={6} className="h-24 text-center !text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-text-muted">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={6} className="h-24 text-center !text-text-muted">
                    No packages found.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map(pkg => (
                  <TableRow
                    key={pkg.id}
                    className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background"
                    onClick={() => onEdit(pkg)}
                  >
                    <TableCell className="py-1 text-text">
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-text">
                          {pkg.title || 'Unnamed Package'}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {pkg.description || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="text-sm font-medium text-text">
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
                    <TableCell className="py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Last Modified:</div>
                      <div className="text-sm text-text-muted">
                        {pkg.updatedAt && !Number.isNaN(new Date(pkg.updatedAt).getTime())
                          ? new Date(pkg.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            onEdit(pkg);
                          }}
                          className="group size-8 hover:border hover:border-border hover:bg-background-light"
                        >
                          <RiEditLine size={14} className="shrink-0" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            onDelete(pkg.id, pkg.title);
                          }}
                          className="group size-8 hover:border hover:border-border hover:bg-background-light"
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
