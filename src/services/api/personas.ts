import axiosInstance from '@/lib/axios';
import { CreatePersonaRequest, PersonaWithKnowledgeBase, UpdatePersonaRequest } from '@/types/chat';

interface PersonasApiClient {
  getPersonas(): Promise<PersonaWithKnowledgeBase[]>;
  createPersona(_data: CreatePersonaRequest): Promise<PersonaWithKnowledgeBase>;
  updatePersona(_id: number, _data: UpdatePersonaRequest): Promise<PersonaWithKnowledgeBase>;
  deletePersona(_id: number): Promise<void>;
}

export const personasApi: PersonasApiClient = {
  async getPersonas(): Promise<PersonaWithKnowledgeBase[]> {
    const response = await axiosInstance.get('/personas');
    return response.data.personas || [];
  },

  async createPersona(data: CreatePersonaRequest): Promise<PersonaWithKnowledgeBase> {
    const response = await axiosInstance.post('/personas', data);
    return response.data.persona;
  },

  async updatePersona(id: number, data: UpdatePersonaRequest): Promise<PersonaWithKnowledgeBase> {
    const response = await axiosInstance.put(`/personas/${id}`, data);
    return response.data.persona;
  },

  async deletePersona(id: number): Promise<void> {
    await axiosInstance.delete(`/personas/${id}`);
  },
};
