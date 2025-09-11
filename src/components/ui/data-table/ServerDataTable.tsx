'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/molecules/common/Table';
import { cx } from '@/lib/utils';
import * as React from 'react';
import { useState } from 'react';

import { DataTableBulkEditor } from './DataTableBulkEditor';
import { DataTablePagination } from './DataTablePagination';

import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableSkeleton } from './TableSkeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterComponent?: React.ComponentType<any>;
  onFiltersChange?: OnChangeFn<ColumnFiltersState>;
  enableClientSideFiltering?: boolean;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: Record<string, boolean>;
  isLoading: boolean;
  enableMultiRowSelection?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  getCoreRowModel?: () => any;
}

export function ServerDataTable<TData, TValue>({
  columns,
  data,
  filterComponent: FilterComponent,
  onFiltersChange,
  enableClientSideFiltering = true,
  initialColumnFilters = [],
  initialColumnVisibility = {},
  isLoading,
  enableMultiRowSelection = true,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const pageSize = 10;
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialColumnFilters || []
  );

  // Update columnFilters when initialColumnFilters changes
  React.useEffect(() => {
    setColumnFilters(initialColumnFilters);
  }, [initialColumnFilters]);

  // Handle row selection based on multi or single selection mode
  const handleRowSelectionChange = React.useCallback(
    (updaterOrValue: any) => {
      if (!enableMultiRowSelection) {
        // For single selection, clear previous selection and select only the current row
        const newValue = typeof updaterOrValue === 'function' ? updaterOrValue({}) : updaterOrValue;

        // Get the selected row ID
        const selectedId = Object.keys(newValue)[0];

        // If there's a selected row and it's different from the current selection
        if (
          (selectedId && Object.keys(rowSelection).length === 0) ||
          !Object.keys(rowSelection).includes(selectedId)
        ) {
          setRowSelection({ [selectedId]: true });
        } else {
          // Toggle selection if clicking the same row
          setRowSelection({});
        }
      } else {
        // For multi-selection, use the default behavior
        setRowSelection(updaterOrValue);
      }
    },
    [enableMultiRowSelection, rowSelection]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility: initialColumnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    enableMultiRowSelection: enableMultiRowSelection,
    manualFiltering: !enableClientSideFiltering,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableClientSideFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    onColumnFiltersChange: filters => {
      setColumnFilters(filters);
      if (onFiltersChange) {
        onFiltersChange(filters);
      }
    },
  });

  const handleRowClick = React.useCallback(
    (row: Row<TData>) => {
      if (onRowClick) {
        onRowClick(row);
      }

      if (!enableMultiRowSelection) {
        // For single selection mode
        const isSelected = row.getIsSelected();
        // Clear all selections
        table.resetRowSelection();
        // Toggle the clicked row
        row.toggleSelected(!isSelected);
      } else {
        // For multi-selection mode, just toggle
        row.toggleSelected(!row.getIsSelected());
      }
    },
    [onRowClick, enableMultiRowSelection, table]
  );

  return (
    <>
      <div className="space-y-3">
        {FilterComponent && (
          <FilterComponent
            table={table}
            onFilterChange={(column: string, value: any) => {
              // Update the column filter in the table
              table.getColumn(column)?.setFilterValue(value);
            }}
          />
        )}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="overflow-x-auto">
              <Table className="min-w-full border-collapse bg-white text-left dark:bg-gray-950">
                <TableHead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/50"
                    >
                      {headerGroup.headers.map(header => (
                        <TableHeaderCell
                          key={header.id}
                          className={cx(
                            'whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 sm:px-6 dark:text-gray-100',
                            header.column.columnDef.meta?.className,
                            header.column.id === 'actions' &&
                              'sticky right-0 z-10 bg-gray-50/80 dark:bg-gray-900/50'
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHeaderCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleRowClick(row)}
                        className={cx(
                          'group cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-900/50',
                          row.getIsSelected() && 'bg-indigo-50/50 dark:bg-indigo-900/20'
                        )}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell
                            key={cell.id}
                            className={cx(
                              'relative whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6 dark:text-gray-300',
                              cell.column.columnDef.meta?.className,
                              index === 0 && 'first:w-10',
                              cell.column.id === 'actions' &&
                                'sticky right-0 z-10 bg-white dark:bg-gray-950'
                            )}
                          >
                            {index === 0 && row.getIsSelected() && (
                              <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600 dark:bg-indigo-500" />
                            )}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {enableMultiRowSelection && (
              <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
                <DataTableBulkEditor table={table} rowSelection={rowSelection} />
              </div>
            )}
            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
              <DataTablePagination table={table} pageSize={pageSize} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
