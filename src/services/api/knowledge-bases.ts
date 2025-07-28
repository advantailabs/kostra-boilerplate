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
  getKnowledgeBases(_page?: number, _limit?: number): Promise<KnowledgeBasesResponse>;
  getKnowledgeBase(_id: number): Promise<KnowledgeBase>;
  createKnowledgeBase(_data: any): Promise<KnowledgeBase>;
  updateKnowledgeBase(_id: number, _data: any): Promise<KnowledgeBase>;
  deleteKnowledgeBase(_id: number): Promise<void>;
}

export const knowledgeBasesApi: KnowledgeBasesApiClient = {
  async getKnowledgeBases(_page = 1, _limit = 50): Promise<KnowledgeBasesResponse> {
    const response = await axiosInstance.get('/knowledge-bases', {
      params: { page: _page, limit: _limit },
    });
    return response.data;
  },

  async getKnowledgeBase(_id: number): Promise<KnowledgeBase> {
    const response = await axiosInstance.get(`/knowledge-bases/${_id}`);
    return response.data;
  },

  async createKnowledgeBase(_data: any): Promise<KnowledgeBase> {
    const response = await axiosInstance.post('/knowledge-bases', _data);
    return response.data;
  },

  async updateKnowledgeBase(_id: number, _data: any): Promise<KnowledgeBase> {
    const response = await axiosInstance.put(`/knowledge-bases/${_id}`, _data);
    return response.data;
  },

  async deleteKnowledgeBase(_id: number): Promise<void> {
    await axiosInstance.delete(`/knowledge-bases/${_id}`);
  },
};
