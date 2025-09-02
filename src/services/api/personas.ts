import axiosInstance from '@/lib/axios';
import { CreatePersonaRequest, PublicPersona, UpdatePersonaRequest } from '@/types/chat';

interface PersonasApiClient {
  getPersonas(): Promise<PublicPersona[]>;
  createPersona(_data: CreatePersonaRequest): Promise<PublicPersona>;
  updatePersona(_id: number, _data: UpdatePersonaRequest): Promise<PublicPersona>;
  deletePersona(_id: number): Promise<void>;
}

export const personasApi: PersonasApiClient = {
  async getPersonas(): Promise<PublicPersona[]> {
    const response = await axiosInstance.get('/personas');
    return response.data.data?.personas || [];
  },

  async createPersona(data: CreatePersonaRequest): Promise<PublicPersona> {
    const response = await axiosInstance.post('/personas', data);
    return response.data.data?.persona;
  },

  async updatePersona(id: number, data: UpdatePersonaRequest): Promise<PublicPersona> {
    const response = await axiosInstance.put(`/personas/${id}`, data);
    return response.data.data || response.data.persona;
  },

  async deletePersona(id: number): Promise<void> {
    await axiosInstance.delete(`/personas/${id}`);
  },
};
