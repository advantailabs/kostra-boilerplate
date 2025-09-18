import { categoriesApi, type CategoryFilters } from '@/services/api/categories';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

export function useCategories(filters?: CategoryFilters) {
  // Normalize filters to create a stable query key
  const normalizedFilters = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.name && { name: filters.name }),
    ...(filters?.slug && { slug: filters.slug }),
    ...(filters?.sortBy && { sortBy: filters.sortBy }),
    ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
  };

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories', normalizedFilters],
    queryFn: () => categoriesApi.getCategories(normalizedFilters),
  });

  const categories = response?.data || [];
  const pagination = response?.pagination;

  const createCategoryMutation = useApiMutation({
    mutationFn: (data: { name: string; slug: string }) => categoriesApi.createCategory(data),
    successMessage: 'Category created successfully!',
    invalidateQueries: [['categories']],
  });

  const updateCategoryMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; slug: string } }) =>
      categoriesApi.updateCategory(id, data),
    successMessage: 'Category updated successfully!',
    invalidateQueries: [['categories']],
  });

  const deleteCategoryMutation = useApiMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    successMessage: 'Category deleted successfully!',
    onSuccess: () => {
      // Refetch the current query directly instead of invalidating
      refetch();
    },
  });

  return {
    categories,
    pagination,
    isLoading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
