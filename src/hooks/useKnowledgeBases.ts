import { knowledgeBasesApi } from '@/services/api/knowledge-bases';
import { useAuthStore } from '@/store/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

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
  return useApiMutation({
    mutationFn: (data: any) => knowledgeBasesApi.createKnowledgeBase(data),
    successMessage: 'Knowledge base created successfully!',
    invalidateQueries: [['knowledge-bases']],
  });
}

export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      knowledgeBasesApi.updateKnowledgeBase(id, data),
    successMessage: 'Knowledge base updated successfully!',
    // Do not pass invalidateQueries here to avoid duplicate invalidation
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    },
  });
}

export function useDeleteKnowledgeBase() {
  return useApiMutation({
    mutationFn: ({ id, deleteFiles }: { id: number; deleteFiles?: boolean }) =>
      knowledgeBasesApi.deleteKnowledgeBase(id, deleteFiles),
    successMessage: 'Knowledge base deleted successfully!',
    invalidateQueries: [['knowledge-bases']],
  });
}

export function useAddFileToKnowledgeBase() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ knowledgeBaseId, fileId }: { knowledgeBaseId: number; fileId: number }) =>
      knowledgeBasesApi.addFileToKnowledgeBase(knowledgeBaseId, fileId),
    successMessage: 'File added to knowledge base!',
    onSuccess: (_, { knowledgeBaseId }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useRemoveFileFromKnowledgeBase() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ knowledgeBaseId, fileId }: { knowledgeBaseId: number; fileId: number }) =>
      knowledgeBasesApi.removeFileFromKnowledgeBase(knowledgeBaseId, fileId),
    successMessage: 'File removed from knowledge base!',
    onSuccess: (_, { knowledgeBaseId }) => {
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
