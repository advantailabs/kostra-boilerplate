import { knowledgeBasesApi } from '@/services/api/knowledge-bases';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useKnowledgeBases(page = 1, limit = 50) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['knowledge-bases', page, limit],
    queryFn: () => knowledgeBasesApi.getKnowledgeBases(page, limit),
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });
}

export function useKnowledgeBase(id: number) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['knowledge-base', id],
    queryFn: () => knowledgeBasesApi.getKnowledgeBase(id),
    enabled: !!user?.id && !!id,
    refetchOnWindowFocus: false,
  });
}

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => knowledgeBasesApi.createKnowledgeBase(data),
    onSuccess: () => {
      // Invalidate and refetch knowledge bases list
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    },
  });
}

export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      knowledgeBasesApi.updateKnowledgeBase(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific knowledge base and knowledge bases list
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    },
  });
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deleteFiles }: { id: number; deleteFiles?: boolean }) =>
      knowledgeBasesApi.deleteKnowledgeBase(id, deleteFiles),
    onSuccess: () => {
      // Invalidate knowledge bases list
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    },
  });
}

export function useAddFileToKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ knowledgeBaseId, fileId }: { knowledgeBaseId: number; fileId: number }) =>
      knowledgeBasesApi.addFileToKnowledgeBase(knowledgeBaseId, fileId),
    onSuccess: (_, { knowledgeBaseId }) => {
      // Invalidate specific knowledge base and knowledge bases list
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useRemoveFileFromKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ knowledgeBaseId, fileId }: { knowledgeBaseId: number; fileId: number }) =>
      knowledgeBasesApi.removeFileFromKnowledgeBase(knowledgeBaseId, fileId),
    onSuccess: (_, { knowledgeBaseId }) => {
      // Invalidate specific knowledge base and knowledge bases list
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

// Export all mutations for convenience
export function useKnowledgeBaseMutations() {
  return {
    createKnowledgeBase: useCreateKnowledgeBase(),
    updateKnowledgeBase: useUpdateKnowledgeBase(),
    deleteKnowledgeBase: useDeleteKnowledgeBase(),
    addFileToKnowledgeBase: useAddFileToKnowledgeBase(),
    removeFileFromKnowledgeBase: useRemoveFileFromKnowledgeBase(),
  };
}
