import { threadsApi } from '@/services/api/threads';
import { ThreadWithPersona } from '@/types/chat';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useThreads() {
  const queryClient = useQueryClient();

  // Legacy full fetch (keep for screens that expect full list)
  const {
    data: threads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['threads'],
    queryFn: threadsApi.getThreads,
  });

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
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const infiniteThreads = (infinite.data?.pages.flatMap(p => p.page) || []) as ThreadWithPersona[];

  return {
    threads: threads as ThreadWithPersona[],
    isLoading,
    error,
    refetch,
    deleteThread: deleteThreadMutation.mutateAsync,
    isDeleting: deleteThreadMutation.isPending,
    // Infinite helpers
    infiniteThreads,
    loadMore: infinite.fetchNextPage,
    hasMore: infinite.hasNextPage ?? false,
    isLoadingMore: infinite.isFetchingNextPage,
  };
}
