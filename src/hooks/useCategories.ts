import { categoriesApi, type CategoryFilters } from '@/services/api/categories';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

export function useCategories(filters?: CategoryFilters) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoriesApi.getCategories(filters),
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
    invalidateQueries: [['categories']],
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

export function useCategory(id: number) {
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });

  return {
    category,
    isLoading,
    error,
    refetch,
  };
}
