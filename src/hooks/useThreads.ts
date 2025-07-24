import { threadsApi } from '@/services/api/threads';
import { CreateThreadRequest, ThreadWithPersona } from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useThreads() {
  const queryClient = useQueryClient();

  const {
    data: threads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['threads'],
    queryFn: threadsApi.getThreads,
  });

  const createThreadMutation = useMutation({
    mutationFn: (data: CreateThreadRequest) => threadsApi.createThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: (id: number) => threadsApi.deleteThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  return {
    threads: threads as ThreadWithPersona[],
    isLoading,
    error,
    refetch,
    createThread: createThreadMutation.mutateAsync,
    deleteThread: deleteThreadMutation.mutateAsync,
    isCreating: createThreadMutation.isPending,
    isDeleting: deleteThreadMutation.isPending,
  };
}
