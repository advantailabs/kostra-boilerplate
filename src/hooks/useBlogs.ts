import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';
import { blogsApi, type BlogFilters } from '@/services/api/blogs';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

export function useBlogs(filters?: BlogFilters) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blogs', filters],
    queryFn: () => blogsApi.getBlogs(filters),
  });

  const blogs = response?.data || [];
  const pagination = response?.pagination;

  const createBlogMutation = useApiMutation({
    mutationFn: (data: CreateBlogInput) => blogsApi.createBlog(data),
    successMessage: 'Blog created successfully!',
    invalidateQueries: [['blogs']],
  });

  const updateBlogMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBlogInput }) =>
      blogsApi.updateBlog(id, data),
    successMessage: 'Blog updated successfully!',
    invalidateQueries: [['blogs']],
  });

  const deleteBlogMutation = useApiMutation({
    mutationFn: (id: number) => blogsApi.deleteBlog(id),
    successMessage: 'Blog deleted successfully!',
    invalidateQueries: [['blogs']],
  });

  return {
    blogs,
    pagination,
    isBlogsLoading: isLoading,
    error,
    refetchBlogs: refetch,
    createBlog: createBlogMutation.mutateAsync,
    updateBlog: updateBlogMutation.mutateAsync,
    deleteBlog: deleteBlogMutation.mutateAsync,
    isCreating: createBlogMutation.isPending,
    isUpdating: updateBlogMutation.isPending,
    isDeleting: deleteBlogMutation.isPending,
  };
}
