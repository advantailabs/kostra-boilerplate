import axiosInstance from '@/lib/axios';
import { KnowledgeBaseWithFiles } from '@/types/chat';

export interface KnowledgeBasesResponse {
  knowledgeBases: KnowledgeBaseWithFiles[];
  total: number;
}

interface KnowledgeBasesApiClient {
  getKnowledgeBases(_page?: number, _limit?: number): Promise<KnowledgeBasesResponse>;
  getKnowledgeBase(_id: number): Promise<KnowledgeBaseWithFiles>;
  createKnowledgeBase(_data: any): Promise<KnowledgeBaseWithFiles>;
  updateKnowledgeBase(_id: number, _data: any): Promise<KnowledgeBaseWithFiles>;
  deleteKnowledgeBase(_id: number, _deleteFiles?: boolean): Promise<void>;
  addFileToKnowledgeBase(_knowledgeBaseId: number, _fileId: number): Promise<void>;
  removeFileFromKnowledgeBase(_knowledgeBaseId: number, _fileId: number): Promise<void>;
}

export const knowledgeBasesApi: KnowledgeBasesApiClient = {
  async getKnowledgeBases(_page = 1, _limit = 50): Promise<KnowledgeBasesResponse> {
    const response = await axiosInstance.get('/knowledge-bases', {
      params: { page: _page, limit: _limit },
    });
    return response.data;
  },

  async getKnowledgeBase(_id: number): Promise<KnowledgeBaseWithFiles> {
    const response = await axiosInstance.get(`/knowledge-bases/${_id}`);
    return response.data.knowledgeBase;
  },

  async createKnowledgeBase(_data: any): Promise<KnowledgeBaseWithFiles> {
    const response = await axiosInstance.post('/knowledge-bases', _data);
    return response.data.knowledgeBase;
  },

  async updateKnowledgeBase(_id: number, _data: any): Promise<KnowledgeBaseWithFiles> {
    const response = await axiosInstance.put(`/knowledge-bases/${_id}`, _data);
    return response.data.knowledgeBase;
  },

  async deleteKnowledgeBase(_id: number, _deleteFiles = false): Promise<void> {
    await axiosInstance.delete(`/knowledge-bases/${_id}`, {
      params: { deleteFiles: _deleteFiles },
    });
  },

  async addFileToKnowledgeBase(knowledgeBaseId: number, fileId: number): Promise<void> {
    await axiosInstance.post(`/knowledge-bases/${knowledgeBaseId}/files`, {
      fileId,
    });
  },

  async removeFileFromKnowledgeBase(knowledgeBaseId: number, fileId: number): Promise<void> {
    await axiosInstance.delete(`/knowledge-bases/${knowledgeBaseId}/files`, {
      data: { fileId },
    });
  },
};
