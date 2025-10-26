import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// import { CREDIT_COSTS } from '@/lib/constants/credits'; // Removed as only INITIAL_CREDITS is supported
import { getCreditHistory, getUserCredits, type CreditHistoryItem } from '@/services/api/credits';
import { useAuthStore } from '@/store/auth';

export function useCredits(limit = 100) {
  const { user } = useAuthStore();

  const creditsQuery = useQuery({
    queryKey: ['credits'],
    queryFn: getUserCredits,
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  const historyQuery = useQuery<CreditHistoryItem[]>({
    queryKey: ['creditHistory', limit],
    queryFn: () => getCreditHistory(limit),
    enabled: !!user?.id,
    staleTime: 30_000,
  });

  const totals = useMemo(() => {
    const items = historyQuery.data ?? [];
    const credit = items.filter(h => h.type === 'CREDIT').reduce((s, h) => s + h.amount, 0);
    const debit = items.filter(h => h.type === 'DEBIT').reduce((s, h) => s + Math.abs(h.amount), 0);
    return { credit, debit };
  }, [historyQuery.data]);

  return {
    // credits
    credits: creditsQuery.data,
    isLoadingCredits: creditsQuery.isLoading,
    isFetchingCredits: creditsQuery.isFetching,
    refetchCredits: creditsQuery.refetch,

    // history
    history: historyQuery.data ?? [],
    isLoadingHistory: historyQuery.isLoading,
    isFetchingHistory: historyQuery.isFetching,
    refetchHistory: historyQuery.refetch,
    totals,

    // helpers
    // hasInsufficientCredits, // Removed as only INITIAL_CREDITS operation is supported

    // combined loading flags for convenience
    isLoading: creditsQuery.isLoading || historyQuery.isLoading,
    isFetching: creditsQuery.isFetching || historyQuery.isFetching,
    isReady: !creditsQuery.isLoading && !historyQuery.isLoading,
  } as const;
}
