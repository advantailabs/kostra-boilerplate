import { axios } from '@/lib/utils';
import { ContactSubmissionFilters, ContactSubmissionResponse } from '@/types/contact';

export interface UpdateContactSubmissionRequest {
  status?: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export interface CreateContactSubmissionRequest {
  name: string;
  email: string;
  purpose: string;
  message: string;
}

export const contactClient = {
  async list(
    page = 1,
    limit = 20,
    filters: ContactSubmissionFilters = {}
  ): Promise<ContactSubmissionResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters.status) params.append('status', String(filters.status));
    if (filters.purpose) params.append('purpose', String(filters.purpose));
    if (filters.search) params.append('search', filters.search);

    const response = await axios.get(`/contact?${params.toString()}`);
    const payload = (response.data as any).data;
    return (payload && (payload as any).data) ?? payload;
  },

  async getById(id: number) {
    const response = await axios.get(`/contact/${id}`);
    const payload = (response.data as any).data;
    return (payload && (payload as any).data) ?? payload;
  },

  async create(data: CreateContactSubmissionRequest) {
    try {
      const response = await axios.post(`/contact`, data);
      const payload = (response.data as any).data;
      return (payload && (payload as any).data) ?? payload;
    } catch (error: any) {
      // If the error has a response with data, extract the message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Otherwise, re-throw the original error
      throw error;
    }
  },

  async update(id: number, data: UpdateContactSubmissionRequest) {
    const response = await axios.put(`/contact/${id}`, data);
    const payload = (response.data as any).data;
    return (payload && (payload as any).data) ?? payload;
  },

  async remove(id: number) {
    const response = await axios.delete(`/contact/${id}`);
    const payload = (response.data as any).data;
    return (payload && (payload as any).data) ?? payload;
  },
};
