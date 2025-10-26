'use client';

import { Badge } from '@/components/atom/Badge';
import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { GradientCtaButton } from '@/components/molecules/common/GradientCtaButton';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Table, TableBody, TableCell, TableRow } from '@/components/molecules/common/Table';
import { useCredits } from '@/hooks/useCredits';
import { formatters } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { openCreditPurchase } from '@/store/ui/modals';
import { RiCoinLine, RiVipCrownLine } from '@remixicon/react';

export default function CreditHistoryPage() {
  const { history, totals, isLoading } = useCredits(100);
  const user = useAuthStore(state => state.user);

  if (isLoading) return <LoadingScreen message="Loading credit history..." />;

  return (
    <div className="min-h-screen bg-background">
      <PageHeaderWithAction
        title="Credit History"
        description="All credit and debit transactions"
      />

      <div className="h-full p-4 max-sm:p-3">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-xl bg-background-light p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
            <div className="text-xs text-text-muted">Available Credits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-text">
              <RiCoinLine className="h-5 w-5 text-yellow-500" /> <CreditDisplay showIcon={false} />
            </div>
          </div>
          <div className="rounded-xl bg-background-light p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
            <div className="text-xs text-text-muted">Total Credits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              <RiCoinLine className="h-5 w-5" /> {formatters.unit(totals.credit)}
            </div>
          </div>
          <div className="rounded-xl bg-background-light p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
            <div className="text-xs text-text-muted">Total Debits</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-rose-600 dark:text-rose-400">
              <RiCoinLine className="h-5 w-5" /> {formatters.unit(totals.debit)}
            </div>
          </div>
          {user?.plan !== 'PRO' && (
            <div className="rounded-xl bg-background-light p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
              <div className="text-xs text-text-muted">Current Plan</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                  <RiVipCrownLine className="h-5 w-5" /> Free Plan
                </div>
                <GradientCtaButton
                  label="Upgrade to Pro"
                  onClick={() => openCreditPurchase()}
                  size="md"
                />
              </div>
            </div>
          )}
          {user?.plan === 'PRO' && (
            <div className="rounded-xl bg-background-light p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
              <div className="text-xs text-text-muted">Pro Renewal</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                <RiVipCrownLine className="h-5 w-5" />
                {user.planExpiringAt ? new Date(user.planExpiringAt).toLocaleDateString() : '-'}
              </div>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="border-0">
            <TableBody>
              {history.length === 0 ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell className="p-3 text-center text-text-muted" colSpan={7}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map(item => (
                  <TableRow
                    key={item.id}
                    className="group border-b border-border-light bg-background-light hover:bg-background"
                  >
                    <TableCell className="whitespace-nowrap py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Date:</div>
                      <div className="text-sm text-text">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-text-muted">
                      <div className="text-sm">
                        <Badge variant={item.type === 'CREDIT' ? 'success' : 'error'}>
                          {item.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Operation:</div>
                      <div className="text-sm text-text">{item.operation.replace('_', ' ')}</div>
                    </TableCell>
                    <TableCell className="py-1 text-text-muted">
                      <div className="text-sm">
                        <Badge variant={item.type === 'CREDIT' ? 'success' : 'error'}>
                          {item.amount > 0 ? `+${item.amount}` : item.amount}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Balance:</div>
                      <div className="text-sm text-text">{item.balanceAfter.toFixed(1)}</div>
                    </TableCell>
                    <TableCell className="py-1 text-text-muted">
                      <div className="text-xs text-text-muted">Reference:</div>
                      <div className="font-mono text-[10px] text-text">{item.objectId || '-'}</div>
                    </TableCell>
                    <TableCell
                      className="max-w-[240px] truncate py-1 text-text-muted"
                      title={item.description || ''}
                    >
                      <div className="text-xs text-text-muted">Description:</div>
                      <div className="text-sm text-text">{item.description || '-'}</div>
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
