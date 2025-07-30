import axiosInstance from '@/lib/axios';

export interface FileFilters {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'size' | 'mimeType';
  sortOrder?: 'asc' | 'desc';
  knowledgeBaseId?: number;
  personaId?: number;
  mimeType?: string;
}

export interface FileListResponse {
  files: any[];
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
  }>;
  knowledgeBaseIds?: number[];
}

export interface UpdateFileRequest {
  originalName?: string;
  knowledgeBaseIds?: number[];
}

interface FilesApiClient {
  getFiles(_page?: number, _limit?: number, _filters?: FileFilters): Promise<FileListResponse>;
  getFile(_id: number): Promise<any>;
  uploadFiles(_data: UploadFilesRequest): Promise<any>;
  updateFile(_id: number, _data: UpdateFileRequest): Promise<any>;
  deleteFile(_id: number, _permanent?: boolean): Promise<any>;
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
    if (_filters?.knowledgeBaseId)
      params.append('knowledgeBaseId', _filters.knowledgeBaseId.toString());
    if (_filters?.personaId) params.append('personaId', _filters.personaId.toString());
    if (_filters?.mimeType) params.append('mimeType', _filters.mimeType);

    const response = await axiosInstance.get(`/files?${params.toString()}`);
    return response.data;
  },

  async getFile(_id: number): Promise<any> {
    const response = await axiosInstance.get(`/files/${_id}`);
    return response.data;
  },

  async uploadFiles(_data: UploadFilesRequest): Promise<any> {
    const response = await axiosInstance.post('/files', _data);
    return response.data;
  },

  async updateFile(_id: number, _data: UpdateFileRequest): Promise<any> {
    const response = await axiosInstance.put(`/files/${_id}`, _data);
    return response.data;
  },

  async deleteFile(_id: number): Promise<any> {
    const response = await axiosInstance.delete(`/files/${_id}`);
    return response.data;
  },
};

export async function generateFileDownloadUrl(fileId: number): Promise<{
  downloadUrl: string;
  expiresAt: Date;
  filename: string;
}> {
  const response = await axiosInstance.post(`/files/${fileId}/download`);
  return response.data;
}
