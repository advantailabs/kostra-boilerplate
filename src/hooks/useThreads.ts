import { threadsApi } from '@/services/api/threads';
import { ThreadWithPersona } from '@/types/chat';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useThreads() {
  const queryClient = useQueryClient();

  // Infinite query for sidebar lazy loading (15 per page)
  const PAGE_SIZE = 15;
  const infinite = useInfiniteQuery({
    queryKey: ['threads', 'infinite'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { threads: page, pagination } = await threadsApi.getThreadsPaginated({
        limit: PAGE_SIZE,
        offset,
      });
      return { page, nextOffset: offset + PAGE_SIZE, hasMore: pagination.hasMore };
    },
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.nextOffset : undefined),
  });

  const deleteThreadMutation = useMutation({
    mutationFn: (id: number) => threadsApi.deleteThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads', 'infinite'] });
    },
  });

  const infiniteThreads = (infinite.data?.pages.flatMap(p => p.page) || []) as ThreadWithPersona[];

  return {
    // Backwards-compatible aliases for previous consumers
    threads: infiniteThreads,
    isLoading: infinite.isLoading,
    error: infinite.isError ? (infinite.error as any) : null,
    refetch: infinite.refetch,
    deleteThread: deleteThreadMutation.mutateAsync,
    isDeleting: deleteThreadMutation.isPending,
    // Infinite helpers
    loadMore: infinite.fetchNextPage,
    hasMore: infinite.hasNextPage ?? false,
    isLoadingMore: infinite.isFetchingNextPage,
  };
}
