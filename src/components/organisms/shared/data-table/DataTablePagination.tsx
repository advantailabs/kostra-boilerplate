import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/atom/Button';
import { cx } from '@/lib/utils';

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pageSize,
  pagination,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  // Use external pagination if provided, otherwise use internal pagination
  const isExternalPagination = !!pagination;

  const paginationButtons = [
    {
      icon: RiArrowLeftDoubleLine,
      onClick: () => {
        if (isExternalPagination && onPageChange) {
          onPageChange(1);
        } else {
          table.setPageIndex(0);
        }
      },
      disabled: isExternalPagination ? !pagination?.hasPreviousPage : !table.getCanPreviousPage(),
      srText: 'First page',
      mobileView: 'hidden sm:block',
    },
    {
      icon: RiArrowLeftSLine,
      onClick: () => {
        if (isExternalPagination && onPageChange && pagination) {
          onPageChange(pagination.page - 1);
        } else {
          table.previousPage();
        }
      },
      disabled: isExternalPagination ? !pagination?.hasPreviousPage : !table.getCanPreviousPage(),
      srText: 'Previous page',
      mobileView: '',
    },
    {
      icon: RiArrowRightSLine,
      onClick: () => {
        if (isExternalPagination && onPageChange && pagination) {
          onPageChange(pagination.page + 1);
        } else {
          table.nextPage();
        }
      },
      disabled: isExternalPagination ? !pagination?.hasNextPage : !table.getCanNextPage(),
      srText: 'Next page',
      mobileView: '',
    },
    {
      icon: RiArrowRightDoubleLine,
      onClick: () => {
        if (isExternalPagination && onPageChange && pagination) {
          onPageChange(pagination.totalPages);
        } else {
          table.setPageIndex(table.getPageCount() - 1);
        }
      },
      disabled: isExternalPagination ? !pagination?.hasNextPage : !table.getCanNextPage(),
      srText: 'Last page',
      mobileView: 'hidden sm:block',
    },
  ];

  // Calculate display values based on pagination type
  const totalRows = isExternalPagination
    ? pagination?.totalCount || 0
    : table.getFilteredRowModel().rows.length;
  const firstRowIndex = isExternalPagination
    ? ((pagination?.page || 1) - 1) * (pagination?.limit || pageSize) + 1
    : table.getState().pagination.pageIndex * pageSize + 1;
  const lastRowIndex = isExternalPagination
    ? Math.min(totalRows, firstRowIndex + (pagination?.limit || pageSize) - 1)
    : Math.min(totalRows, firstRowIndex + pageSize - 1);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm tabular-nums text-gray-500">
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s) selected.
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <p className="hidden text-sm tabular-nums text-gray-500 sm:block">
          Showing{' '}
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {firstRowIndex}-{lastRowIndex}
          </span>{' '}
          of <span className="font-medium text-gray-900 dark:text-gray-50">{totalRows}</span>
        </p>
        <div className="flex items-center gap-x-1.5">
          {paginationButtons.map((button, index) => (
            <Button
              key={index}
              variant="secondary"
              className={cx(button.mobileView, 'p-1.5')}
              onClick={() => {
                button.onClick();
                if (!isExternalPagination) {
                  table.resetRowSelection();
                }
              }}
              disabled={button.disabled}
            >
              <span className="sr-only">{button.srText}</span>
              <button.icon className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
