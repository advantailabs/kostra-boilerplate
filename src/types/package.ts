import { Prisma } from '@/lib/prisma/generated/client';

// Database operation types
export interface CreatePackageData {
  title: string;
  description: string;
  isFeatured?: boolean;
  price: Prisma.Decimal;
  currencySymbol?: string;
  features: string[];
}

export interface UpdatePackageData {
  title?: string;
  description?: string;
  isFeatured?: boolean;
  price?: Prisma.Decimal;
  currencySymbol?: string;
  features?: string[];
}

// API Request types
export interface CreatePackageRequest {
  title: string;
  description: string;
  isFeatured?: boolean;
  price: number;
  currencySymbol?: string;
  features: string[];
}

export interface UpdatePackageRequest {
  title?: string;
  description?: string;
  isFeatured?: boolean;
  price?: number;
  currencySymbol?: string;
  features?: string[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PackageResponse {
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

// Repository result types
export interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Package filters for API
export interface PackageFilters {
  title?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Paginated response
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
