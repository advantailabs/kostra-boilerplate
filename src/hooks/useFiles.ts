import {
  FileFilters,
  filesApi,
  generateFileDownloadUrl,
  UpdateFileRequest,
  UploadFilesRequest,
} from '@/services/api/files';
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
    mutationFn: ({ id }: { id: number }) => filesApi.deleteFile(id),
    onSuccess: () => {
      // Only invalidate files-related queries
      queryClient.invalidateQueries({ queryKey: ['files'] });
      // Remove unnecessary knowledge base invalidations that cause API calls during download
    },
  });
}

export function useFileDownload() {
  return useMutation({
    mutationFn: generateFileDownloadUrl,
    onSuccess: (data: { downloadUrl: string; expiresAt: Date; filename: string }) => {
      console.log('data', data);

      // Trigger download using the generated URL
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: error => {
      console.error('Error downloading file:', error);
      // You can add toast notification here if needed
    },
  });
}
