import { blogsApi } from '@/services/api/blogs';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

export function useBlogs(filters?: {
  title?: string;
  published?: boolean;
  categoryId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const {
    data: blogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blogs', filters],
    queryFn: () => blogsApi.getBlogs(filters),
  });

  const createBlogMutation = useApiMutation({
    mutationFn: (data: FormData) => blogsApi.createBlog(data),
    successMessage: 'Blog created successfully!',
    invalidateQueries: [['blogs']],
  });

  const updateBlogMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => blogsApi.updateBlog(id, data),
    successMessage: 'Blog updated successfully!',
    invalidateQueries: [['blogs']],
  });

  const deleteBlogMutation = useApiMutation({
    mutationFn: (id: number) => blogsApi.deleteBlog(id),
    successMessage: 'Blog deleted successfully!',
    invalidateQueries: [['blogs']],
  });

  const convertMarkdownMutation = useApiMutation({
    mutationFn: () => blogsApi.convertMarkdown(),
    successMessage: 'Markdown conversion completed!',
    invalidateQueries: [['blogs']],
  });

  return {
    blogs,
    isBlogsLoading: isLoading,
    error,
    refetchBlogs: refetch,
    createBlog: createBlogMutation.mutate,
    updateBlog: updateBlogMutation.mutate,
    deleteBlog: deleteBlogMutation.mutate,
    convertMarkdown: convertMarkdownMutation.mutate,
    isCreating: createBlogMutation.isPending,
    isUpdating: updateBlogMutation.isPending,
    isDeleting: deleteBlogMutation.isPending,
    isConverting: convertMarkdownMutation.isPending,
  };
}

export function useBlog(id: number) {
  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsApi.getBlog(id),
    enabled: !!id,
  });

  return {
    blog,
    isLoading,
    error,
    refetch,
  };
}
