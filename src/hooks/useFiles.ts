import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import {
  FileFilters,
  filesApi,
  generateFileDownloadUrl,
  UpdateFileRequest,
  UploadFilesRequest,
} from '@/services/api/files';
import { useAuthStore } from '@/store/auth';
import { getCredits } from '@/store/credits';
import { openCreditPurchase } from '@/store/ui/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

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
  return useApiMutation({
    mutationFn: async (data: UploadFilesRequest) => {
      const credits = getCredits();
      if (credits < CREDIT_THRESHOLDS.creationMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to upload files');
      }
      return filesApi.uploadFiles(data);
    },
    successMessage: 'Files uploaded successfully!',
    invalidateQueries: [['files']],
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFileRequest }) =>
      filesApi.updateFile(id, data),
    successMessage: 'File updated successfully!',
    // Avoid double invalidation: handle manually here
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['file', id] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  return useApiMutation({
    mutationFn: ({ id }: { id: number }) => filesApi.deleteFile(id),
    successMessage: 'File deleted successfully!',
    invalidateQueries: [['files']],
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
