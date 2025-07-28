import { FileFilters, filesApi, UpdateFileRequest, UploadFilesRequest } from '@/services/api/files';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFiles(filters?: FileFilters, page = 1, limit = 20) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['files', page, limit, filters],
    queryFn: () => filesApi.getFiles(page, limit, filters),
    enabled: !!user?.id,
  });
}

export function useFile(id: number) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['file', id],
    queryFn: () => filesApi.getFile(id),
    enabled: !!user?.id && !!id,
  });
}

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadFilesRequest) => filesApi.uploadFiles(data),
    onSuccess: () => {
      // Invalidate and refetch files list
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFileRequest }) =>
      filesApi.updateFile(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific file and files list
      queryClient.invalidateQueries({ queryKey: ['file', id] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permanent = false }: { id: number; permanent?: boolean }) =>
      filesApi.deleteFile(id, permanent),
    onSuccess: () => {
      // Invalidate files list
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useAddFileToKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, knowledgeBaseId }: { fileId: number; knowledgeBaseId: number }) =>
      filesApi.addFileToKnowledgeBase(fileId, knowledgeBaseId),
    onSuccess: (_, { fileId }) => {
      // Invalidate file knowledge bases and files list
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useRemoveFileFromKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, knowledgeBaseId }: { fileId: number; knowledgeBaseId: number }) =>
      filesApi.removeFileFromKnowledgeBase(fileId, knowledgeBaseId),
    onSuccess: (_, { fileId }) => {
      // Invalidate file knowledge bases and files list
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}
