'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { CreditHistoryItem } from '@/services/api/credits';

export const creditHistoryTableColumns: ColumnDef<CreditHistoryItem>[] = [
  {
    id: 'date',
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div className="whitespace-nowrap py-1 text-text-muted">
        <div className="text-sm text-text">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      </div>
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={item.type === 'CREDIT' ? 'success' : 'error'}>
          {item.type}
        </Badge>
      );
    },
  },
  {
    id: 'operation',
    accessorKey: 'operation',
    header: 'Operation',
    cell: ({ row }) => (
      <div className="whitespace-nowrap py-1 text-sm text-text">
        {row.original.operation.replace(/_/g, ' ')}
      </div>
    ),
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const item = row.original;
      const displayAmount = item.amount > 0 ? `+${item.amount}` : String(item.amount);
      return (
        <Badge variant={item.type === 'CREDIT' ? 'success' : 'error'}>
          {displayAmount}
        </Badge>
      );
    },
  },
  {
    id: 'balance',
    accessorKey: 'balanceAfter',
    header: 'Balance',
    cell: ({ row }) => (
      <div className="whitespace-nowrap py-1 text-sm text-text">
        {row.original.balanceAfter.toFixed(1)}
      </div>
    ),
  },
  {
    id: 'reference',
    accessorKey: 'objectId',
    header: 'Reference',
    cell: ({ row }) => (
      <div className="font-mono text-[10px] text-text">
        {row.original.objectId || '-'}
      </div>
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.original.description || '-';
      return (
        <div
          className="max-w-[240px] truncate py-1 text-sm text-text"
          title={row.original.description || ''}
        >
          {desc}
        </div>
      );
    },
  },
];
