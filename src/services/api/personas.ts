import axiosInstance from '@/lib/axios';
import { CreatePersonaRequest, PresignedUrlResponse, UpdatePersonaRequest } from '@/types/chat';
import { Persona } from '@prisma/client';

interface PersonasApiClient {
  getPersonas(): Promise<Persona[]>;
  createPersona(_data: CreatePersonaRequest): Promise<Persona>;
  updatePersona(_id: number, _data: UpdatePersonaRequest): Promise<Persona>;
  deletePersona(_id: number): Promise<void>;
  getPresignedUrl(_fileType: string): Promise<PresignedUrlResponse>;
}

export const personasApi: PersonasApiClient = {
  async getPersonas(): Promise<Persona[]> {
    const response = await axiosInstance.get('/personas');
    return response.data.personas || [];
  },

  async createPersona(data: CreatePersonaRequest): Promise<Persona> {
    const response = await axiosInstance.post('/personas', data);
    return response.data.persona;
  },

  async updatePersona(id: number, data: UpdatePersonaRequest): Promise<Persona> {
    const response = await axiosInstance.put(`/personas/${id}`, data);
    return response.data.persona;
  },

  async deletePersona(id: number): Promise<void> {
    await axiosInstance.delete(`/personas/${id}`);
  },

  async getPresignedUrl(fileType: string): Promise<PresignedUrlResponse> {
    const response = await axiosInstance.post('/personas/presigned-url', { fileType });
    return response.data;
  },
};
