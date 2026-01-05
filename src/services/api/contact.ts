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
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    console.log(response.data);
    // Axios Response data -> standard response data -> contact submission response data
    return response.data.data.data as ContactSubmissionResponse;
  },

  async getById(id: number): Promise<ContactSubmissionResponse> {
    const response = await axios.get(`/contact/${id}`);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data.data as ContactSubmissionResponse;
  },

  async create(data: CreateContactSubmissionRequest) {
    try {
      const response = await axios.post(`/contact`, data);
      if (!response.data) {
        throw new Error('No Data was sent in Response');
      }
      return response.data.data.data as ContactSubmissionResponse;
    } catch (error) {
      // If the error has a response with data, extract the message
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        throw new Error(
          (error as { response?: { data: { message: string } } }).response!.data.message
        );
      }
      // Otherwise, re-throw the original error
      throw error;
    }
  },

  async update(id: number, data: UpdateContactSubmissionRequest) {
    const response = await axios.put(`/contact/${id}`, data);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data.data as ContactSubmissionResponse;
  },

  async remove(id: number) {
    const response = await axios.delete(`/contact/${id}`);
    if (!response.data) {
      throw new Error('No Data was sent in Response');
    }
    return response.data.data.data as ContactSubmissionResponse;
  },
};
