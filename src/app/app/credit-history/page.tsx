'use client';

import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { RiCoinLine, RiVipCrownLine } from '@remixicon/react';

import { Button } from '@/components/atom/Button';
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
import { useAuthStore } from '@/store/auth';
import { openCreditPurchase } from '@/store/ui/modals';

export default function CreditHistoryPage() {
  const { history, totals, isLoading } = useCredits(100);
  const user = useAuthStore(state => state.user);

  if (isLoading) return <LoadingScreen message="Loading credit history..." />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3 dark:border-gray-700">
        <PageHeader title="Credit History" description="All credit and debit transactions" />
      </div>

      <div className="p-4 max-sm:p-3">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
            <div className="text-xs text-gray-500">Available Credits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <RiCoinLine className="h-5 w-5 text-yellow-500" /> <CreditDisplay showIcon={false} />
            </div>
          </div>
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
          {user?.plan !== 'PRO' && (
            <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
              <div className="text-xs text-gray-500">Current Plan</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <RiVipCrownLine className="h-5 w-5" /> Free Plan
                </div>
                <div className="rounded-md bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 p-[1px] shadow-[0_0_16px_rgba(99,102,241,0.35)]">
                  <Button
                    variant="ghost"
                    className="h-8 border-transparent bg-white px-3 text-xs text-gray-900 hover:bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 dark:hover:bg-gray-900/60"
                    onClick={() => openCreditPurchase()}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          )}
          {user?.plan === 'PRO' && (
            <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
              <div className="text-xs text-gray-500">Pro Renewal</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                <RiVipCrownLine className="h-5 w-5" />
                {user.planExpiringAt ? new Date(user.planExpiringAt).toLocaleDateString() : '-'}
              </div>
            </div>
          )}
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
