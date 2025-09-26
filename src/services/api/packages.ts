import { axios } from '@/lib/utils';

export interface Package {
  id: number;
  title: string;
  description: string;
  isFeatured: boolean;
  price: number;
  currencySymbol: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageFilters {
  title?: string;
  isFeatured?: boolean;
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

export const packagesApi = {
  getPackages: async (filters?: PackageFilters): Promise<PaginatedResponse<Package>> => {
    const params = new URLSearchParams();

    if (filters?.title) params.append('title', filters.title);
    if (filters?.isFeatured !== undefined)
      params.append('isFeatured', filters.isFeatured.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(`/packages?${params.toString()}`);
    return response.data.data || response.data;
  },

  getPackage: async (id: number): Promise<Package> => {
    const response = await axios.get(`/packages/${id}`);
    return response.data.data || response.data;
  },

  createPackage: async (data: {
    title: string;
    description: string;
    isFeatured?: boolean;
    price: number;
    currencySymbol?: string;
    features: string[];
  }): Promise<Package> => {
    const response = await axios.post('/packages', data);
    return response.data.data || response.data;
  },

  updatePackage: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      isFeatured?: boolean;
      price?: number;
      currencySymbol?: string;
      features?: string[];
    }
  ): Promise<Package> => {
    const response = await axios.patch(`/packages/${id}`, data);
    return response.data.data || response.data;
  },

  deletePackage: async (id: number): Promise<void> => {
    await axios.delete(`/packages/${id}`);
  },
};
