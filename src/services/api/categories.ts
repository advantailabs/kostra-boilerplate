import { axios } from '@/lib/utils';

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    blogs: number;
  };
}

export interface CategoryFilters {
  name?: string;
  slug?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const categoriesApi = {
  getCategories: async (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const params = new URLSearchParams();

    if (filters?.name) params.append('name', filters.name);
    if (filters?.slug) params.append('slug', filters.slug);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(`/categories?${params.toString()}`);
    return response.data.data || response.data;
  },

  createCategory: async (data: { name: string; slug: string }): Promise<Category> => {
    const response = await axios.post('/categories', data);
    return response.data.data || response.data;
  },

  updateCategory: async (id: number, data: { name: string; slug: string }): Promise<Category> => {
    const response = await axios.patch(`/categories/${id}`, data);
    return response.data.data || response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`/categories/${id}`);
  },
};
