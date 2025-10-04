'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/molecules/common/Table';
import { cx } from '@/lib/utils';

import { DataTableBulkEditor } from './DataTableBulkEditor';
import { Filterbar } from './DataTableFilterbar';
import { DataTablePagination } from './DataTablePagination';

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  showFilterbar?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

export function DataTable<TData>({
  columns,
  data,
  showFilterbar = true,
  pagination,
  onPageChange,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});

  // Use external pagination if provided, otherwise use internal pagination
  const isExternalPagination = !!pagination;
  const pageSize = pagination?.limit || 20;

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: isExternalPagination ? (pagination?.page || 1) - 1 : 0,
        pageSize,
      },
    },
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: isExternalPagination ? undefined : getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: isExternalPagination,
    pageCount: isExternalPagination ? pagination?.totalPages : undefined,
  });

  return (
    <div className="space-y-3">
      {showFilterbar && <Filterbar table={table} />}
      <div className="relative overflow-hidden overflow-x-auto">
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="border border-border"
                style={{ backgroundColor: 'var(--bg-dark)' }}
              >
                {headerGroup.headers.map(header => (
                  <TableHeaderCell
                    key={header.id}
                    className={cx(
                      'whitespace-nowrap py-3 text-base font-semibold text-text',
                      header.column.columnDef.meta?.className
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
                  onClick={() => row.toggleSelected(!row.getIsSelected())}
                  className="group select-none hover:bg-background-light"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cx(
                        row.getIsSelected() ? 'bg-background-light' : '',
                        'relative whitespace-nowrap py-1 text-text first:w-10',
                        cell.column.columnDef.meta?.className
                      )}
                    >
                      {index === 0 && row.getIsSelected() && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTableBulkEditor table={table} rowSelection={rowSelection} />
      </div>
      <DataTablePagination
        table={table}
        pageSize={pageSize}
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
