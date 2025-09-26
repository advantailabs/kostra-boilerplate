import { packagesApi, type PackageFilters } from '@/services/api/packages';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

export function usePackages(filters?: PackageFilters) {
  // Normalize filters to create a stable query key
  const normalizedFilters = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.title && { title: filters.title }),
    ...(filters?.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
    ...(filters?.minPrice !== undefined && { minPrice: filters.minPrice }),
    ...(filters?.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
    ...(filters?.sortBy && { sortBy: filters.sortBy }),
    ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
  };

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['packages', normalizedFilters],
    queryFn: () => packagesApi.getPackages(normalizedFilters),
  });

  const packages = response?.data || [];
  const pagination = response?.pagination;

  const createPackageMutation = useApiMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      isFeatured?: boolean;
      price: number;
      currencySymbol?: string;
      features: string[];
    }) => packagesApi.createPackage(data),
    successMessage: 'Package created successfully!',
    invalidateQueries: [['packages']],
  });

  const updatePackageMutation = useApiMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        title?: string;
        description?: string;
        isFeatured?: boolean;
        price?: number;
        currencySymbol?: string;
        features?: string[];
      };
    }) => packagesApi.updatePackage(id, data),
    successMessage: 'Package updated successfully!',
    invalidateQueries: [['packages']],
  });

  const deletePackageMutation = useApiMutation({
    mutationFn: (id: number) => packagesApi.deletePackage(id),
    successMessage: 'Package deleted successfully!',
    onSuccess: () => {
      // Refetch the current query directly instead of invalidating
      refetch();
    },
  });

  return {
    packages,
    pagination,
    isLoading,
    error,
    refetch,
    createPackage: createPackageMutation.mutate,
    updatePackage: updatePackageMutation.mutate,
    deletePackage: deletePackageMutation.mutate,
    isCreating: createPackageMutation.isPending,
    isUpdating: updatePackageMutation.isPending,
    isDeleting: deletePackageMutation.isPending,
  };
}
