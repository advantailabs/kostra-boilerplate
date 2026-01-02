import { axios } from '@/lib/utils';
import { FileUploadRequest, FileUploadResponse } from '@/types/file-upload';

interface FileUploadApiClient {
  getPresignedUrl(_request: FileUploadRequest): Promise<FileUploadResponse>;
}

export const fileUploadApi: FileUploadApiClient = {
  async getPresignedUrl(_request: FileUploadRequest): Promise<FileUploadResponse> {
    const response = await axios.post('/file-upload/presigned-url', _request);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data as FileUploadResponse;
  },
};
