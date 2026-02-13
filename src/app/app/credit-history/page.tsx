'use client';

import { Coins, Crown } from 'lucide-react';

import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { GradientCtaButton } from '@/components/molecules/common/GradientCtaButton';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { creditHistoryTableColumns } from '@/components/organisms/modules/credit-history/creditHistoryTableColumns';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useCredits } from '@/hooks/useCredits';
import { formatters } from '@/lib/utils';
import type { CreditHistoryItem } from '@/services/api/credits';
import { useAuthStore } from '@/store/auth';
import { openCreditPurchase } from '@/store/ui/modals';

export default function CreditHistoryPage() {
  const { history, totals, isLoading } = useCredits(100);
  const user = useAuthStore(state => state.user);

  if (isLoading) return <LoadingScreen message="Loading credit history..." />;

  return (
    <div className="min-h-screen">
      <PageHeaderWithAction
        title="Credit History"
        description="All credit and debit transactions"
      />

      <div className="p-4 max-sm:p-3">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card size="sm" className="gap-0 py-0">
            <CardContent className="px-3 py-2">
              <CardDescription className="text-xs text-text-muted">
                Available Credits
              </CardDescription>
              <div className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-text">
                <Coins className="h-5 w-5 text-yellow-500" /> <CreditDisplay showIcon={false} />
              </div>
            </CardContent>
          </Card>
          <Card size="sm" className="gap-0 py-0">
            <CardContent className="px-3 py-2">
              <CardDescription className="text-xs text-text-muted">
                Total Credits
              </CardDescription>
              <div className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                <Coins className="h-5 w-5" />
                {typeof formatters.unit === 'function'
                  ? formatters.unit(totals.credit)
                  : totals.credit}
              </div>
            </CardContent>
          </Card>
          <Card size="sm" className="gap-0 py-0">
            <CardContent className="px-3 py-2">
              <CardDescription className="text-xs text-text-muted">
                Total Debits
              </CardDescription>
              <div className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-rose-600 dark:text-rose-400">
                <Coins className="h-5 w-5" />
                {typeof formatters.unit === 'function'
                  ? formatters.unit(totals.debit)
                  : totals.debit}
              </div>
            </CardContent>
          </Card>
          {user?.plan !== 'PRO' && (
            <Card size="sm" className="gap-0 py-0">
              <CardContent className="px-3 py-2">
                <CardDescription className="text-xs text-text-muted">
                  Current Plan
                </CardDescription>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <Crown className="h-5 w-5" /> Free Plan
                  </div>
                  <GradientCtaButton
                    label="Upgrade to Pro"
                    onClick={() => openCreditPurchase()}
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          {user?.plan === 'PRO' && (
            <Card size="sm" className="gap-0 py-0">
              <CardContent className="px-3 py-2">
                <CardDescription className="text-xs text-text-muted">
                  Pro Renewal
                </CardDescription>
                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                  <Crown className="h-5 w-5" />
                  {user.planExpiringAt
                    ? new Date(user.planExpiringAt).toLocaleDateString()
                    : '-'}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background before:pointer-events-none before:inset-0 before:rounded-md">
          <DataTable<CreditHistoryItem, unknown>
            columns={creditHistoryTableColumns}
            data={history}
            emptyMessage="No transactions found."
            isLoading={isLoading}
            loadingMessage="Loading credit history..."
          />
        </div>
      </div>
    </div>
  );
}
