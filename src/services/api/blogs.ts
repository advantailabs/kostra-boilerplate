import { axios } from '@/lib/utils';
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  blogImageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
  categories: {
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
}

export interface BlogFilters {
  title?: string;
  published?: boolean;
  categoryId?: number;
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

export const blogsApi = {
  getBlogs: async (filters?: BlogFilters): Promise<PaginatedResponse<Blog>> => {
    const params = new URLSearchParams();

    if (filters?.title) params.append('title', filters.title);
    if (filters?.published !== undefined) params.append('published', filters.published.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(`/blogs?${params.toString()}`);
    return response.data.data || response.data;
  },

  createBlog: async (data: CreateBlogInput): Promise<Blog> => {
    const response = await axios.post('/blogs', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data || response.data;
  },

  updateBlog: async (id: number, data: UpdateBlogInput): Promise<Blog> => {
    const response = await axios.patch(`/blogs/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data || response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await axios.delete(`/blogs/${id}`);
  },
};
