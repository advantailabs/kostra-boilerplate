'use client';

import { RiCoinLine } from '@remixicon/react';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/molecules/common/Table';
import { useCredits } from '@/hooks/useCredits';
import { formatters } from '@/lib/format-utils';

export default function CreditHistoryPage() {
  const { history, totals, isLoading } = useCredits(100);

  if (isLoading) return <LoadingScreen message="Loading credit history..." />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3 dark:border-gray-700">
        <PageHeader title="Credit History" description="All credit and debit transactions" />
      </div>

      <div className="p-4 max-sm:p-3">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
            <div className="text-xs text-gray-500">Total Credits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              <RiCoinLine className="h-5 w-5" /> {formatters.unit(totals.credit)}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
            <div className="text-xs text-gray-500">Total Debits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-rose-600 dark:text-rose-400">
              <RiCoinLine className="h-5 w-5" /> {formatters.unit(totals.debit)}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 dark:border-gray-800">
          <Table className="text-xs">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">Date</TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">Type</TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">
                  Operation
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">
                  Amount
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">
                  Balance After
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">
                  Reference
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-1.5 text-xs font-medium">
                  Description
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell className="p-3 text-center" colSpan={7}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap p-1.5">
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="p-1.5">
                      <span
                        className={
                          item.type === 'CREDIT'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap p-1.5">
                      {item.operation.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="p-1.5">
                      <span
                        className={
                          item.type === 'CREDIT'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {item.amount > 0 ? `+${item.amount}` : item.amount}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap p-1.5">
                      {item.balanceAfter.toFixed(1)}
                    </TableCell>
                    <TableCell className="p-1.5 font-mono text-[10px] text-gray-500">
                      {item.objectId || '-'}
                    </TableCell>
                    <TableCell
                      className="max-w-[240px] truncate p-1.5"
                      title={item.description || ''}
                    >
                      {item.description || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
