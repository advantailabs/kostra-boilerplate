import { File } from '@/lib/prisma/generated/client';
import { axios } from '@/lib/utils';
import { FileServiceResult } from '../internal/files/file';

export interface FileFilters {
  search?: string;
  sortBy?: 'originalName' | 'createdAt' | 'size' | 'mimeType';
  sortOrder?: 'asc' | 'desc';
  mimeType?: string;
}

export interface FileListResponse {
  files: File[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadFilesRequest {
  files: Array<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    s3Key: string;
    uploadPurpose?: 'UserAvatar' | 'MessageAttachment' | 'UserDocument' | 'BlogImage';
  }>;
}

export interface FileDownloadUrl {
  downloadUrl: string;
  expiresAt: Date;
  filename: string;
}

export interface UpdateFileRequest {
  originalName?: string;
}

function validateAndCastResponse<T>(data: unknown): T {
  if (!data) {
    throw new Error('No Data was sent in Response');
  }
  return data as T;
}

interface FilesApiClient {
  getFiles(_page?: number, _limit?: number, _filters?: FileFilters): Promise<FileListResponse>;
  getFile(_id: number): Promise<FileServiceResult<File>>;
  uploadFiles(_data: UploadFilesRequest): Promise<FileServiceResult<File>>;
  updateFile(_id: number, _data: UpdateFileRequest): Promise<FileServiceResult<File>>;
  deleteFile(_id: number, _permanent?: boolean): Promise<void>;
}

export const filesApi: FilesApiClient = {
  async getFiles(_page = 1, _limit = 20, _filters?: FileFilters): Promise<FileListResponse> {
    const params = new URLSearchParams({
      page: _page.toString(),
      limit: _limit.toString(),
    });

    if (_filters?.search) params.append('search', _filters.search);
    if (_filters?.sortBy) params.append('sortBy', _filters.sortBy);
    if (_filters?.sortOrder) params.append('sortOrder', _filters.sortOrder);
    if (_filters?.mimeType) params.append('mimeType', _filters.mimeType);

    const response = await axios.get(`/files?${params.toString()}`);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data as FileListResponse;
  },

  async getFile(_id: number): Promise<FileServiceResult<File>> {
    const response = await axios.get(`/files/${_id}`);
    return validateAndCastResponse<FileServiceResult<File>>(response.data);
  },

  async uploadFiles(_data: UploadFilesRequest): Promise<FileServiceResult<File>> {
    const response = await axios.post('/files', _data);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data as FileServiceResult<File>;
  },

  async updateFile(_id: number, _data: UpdateFileRequest): Promise<FileServiceResult<File>> {
    const response = await axios.put(`/files/${_id}`, _data);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data as FileServiceResult<File>;
  },

  async deleteFile(_id: number): Promise<void> {
    const response = await axios.delete(`/files/${_id}`);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
  },
};

export async function generateFileDownloadUrl(fileId: number): Promise<FileDownloadUrl> {
  const response = await axios.post(`/files/${fileId}/download`);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as FileDownloadUrl;
}
