import axiosInstance from '@/lib/axios';

export interface KnowledgeBase {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBasesResponse {
  knowledgeBases: KnowledgeBase[];
  total: number;
}

interface KnowledgeBasesApiClient {
  getKnowledgeBases(page?: number, limit?: number): Promise<KnowledgeBasesResponse>;
  getKnowledgeBase(id: number): Promise<KnowledgeBase>;
  createKnowledgeBase(data: any): Promise<KnowledgeBase>;
  updateKnowledgeBase(id: number, data: any): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: number): Promise<void>;
}

export const knowledgeBasesApi: KnowledgeBasesApiClient = {
  async getKnowledgeBases(page = 1, limit = 50): Promise<KnowledgeBasesResponse> {
    const response = await axiosInstance.get('/knowledge-bases', {
      params: { page, limit },
    });
    return response.data;
  },

  async getKnowledgeBase(id: number): Promise<KnowledgeBase> {
    const response = await axiosInstance.get(`/knowledge-bases/${id}`);
    return response.data;
  },

  async createKnowledgeBase(data: any): Promise<KnowledgeBase> {
    const response = await axiosInstance.post('/knowledge-bases', data);
    return response.data;
  },

  async updateKnowledgeBase(id: number, data: any): Promise<KnowledgeBase> {
    const response = await axiosInstance.put(`/knowledge-bases/${id}`, data);
    return response.data;
  },

  async deleteKnowledgeBase(id: number): Promise<void> {
    await axiosInstance.delete(`/knowledge-bases/${id}`);
  },
};
