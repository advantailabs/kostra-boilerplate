import { threadsApi } from '@/services/api/threads';
import { AddMessageRequest } from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useChat(threadId?: number) {
  const queryClient = useQueryClient();

  const {
    data: thread,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => threadsApi.getThread(threadId!),
    enabled: !!threadId,
  });

  const addMessageMutation = useMutation({
    mutationFn: (data: AddMessageRequest) => threadsApi.addMessage(threadId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  return {
    thread,
    isLoading,
    error,
    refetch,
    addMessage: addMessageMutation.mutateAsync,
    isSending: addMessageMutation.isPending,
  };
}
