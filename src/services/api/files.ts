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
  getFiles(page?: number, limit?: number, filters?: FileFilters): Promise<FileListResponse>;
  getFile(id: number): Promise<any>;
  uploadFiles(data: UploadFilesRequest): Promise<any>;
  updateFile(id: number, data: UpdateFileRequest): Promise<any>;
  deleteFile(id: number, permanent?: boolean): Promise<any>;
  addFileToKnowledgeBase(id: number, knowledgeBaseId: number): Promise<any>;
  removeFileFromKnowledgeBase(id: number, knowledgeBaseId: number): Promise<any>;
}

export const filesApi: FilesApiClient = {
  async getFiles(page = 1, limit = 20, filters?: FileFilters): Promise<FileListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.knowledgeBaseId)
      params.append('knowledgeBaseId', filters.knowledgeBaseId.toString());
    if (filters?.personaId) params.append('personaId', filters.personaId.toString());
    if (filters?.mimeType) params.append('mimeType', filters.mimeType);

    const response = await axiosInstance.get(`/files?${params.toString()}`);
    return response.data;
  },

  async getFile(id: number): Promise<any> {
    const response = await axiosInstance.get(`/files/${id}`);
    return response.data;
  },

  async uploadFiles(data: UploadFilesRequest): Promise<any> {
    const response = await axiosInstance.post('/files', data);
    return response.data;
  },

  async updateFile(id: number, data: UpdateFileRequest): Promise<any> {
    const response = await axiosInstance.put(`/files/${id}`, data);
    return response.data;
  },

  async deleteFile(id: number, permanent = false): Promise<any> {
    const response = await axiosInstance.delete(`/files/${id}`, {
      params: { permanent },
    });
    return response.data;
  },

  async addFileToKnowledgeBase(id: number, knowledgeBaseId: number): Promise<any> {
    const response = await axiosInstance.post(`/files/${id}/knowledge-base`, {
      knowledgeBaseId,
    });
    return response.data;
  },

  async removeFileFromKnowledgeBase(id: number, knowledgeBaseId: number): Promise<any> {
    const response = await axiosInstance.delete(`/files/${id}/knowledge-base`, {
      data: { knowledgeBaseId },
    });
    return response.data;
  },
};
