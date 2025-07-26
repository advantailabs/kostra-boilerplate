import axiosInstance from '@/lib/axios';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';

interface FileUploadApiClient {
  getPresignedUrl(request: FileUploadRequest): Promise<FileUploadResponse>;
}

export const fileUploadApi: FileUploadApiClient = {
  async getPresignedUrl(request: FileUploadRequest): Promise<FileUploadResponse> {
    const response = await axiosInstance.post('/file-upload/presigned-url', request);
    return response.data;
  },
};
