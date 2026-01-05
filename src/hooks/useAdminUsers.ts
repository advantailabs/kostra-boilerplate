import { UserRole } from '@/lib/constants/admin';
import { axios } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  isOnboarded: boolean;
  credits: number;
  plan: 'FREE' | 'PRO';
  stripeCustomerId?: string;
  isOverDue?: boolean;
  planExpiringAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  isOnboarded?: boolean;
  credits?: number;
  stripeCustomerId?: string;
  plan?: 'FREE' | 'PRO';
  isOverDue?: boolean;
  planExpiringAt?: string;
  password?: string;
}

interface UseAdminUsersOptions {
  search?: string;
  includeDeleted?: boolean;
  role?: 'USER' | 'ADMIN';
  plan?: 'FREE' | 'PRO';
  isOnboarded?: 'true' | 'false';
  sortBy?:
    | 'id'
    | 'name'
    | 'email'
    | 'role'
    | 'plan'
    | 'isOnboarded'
    | 'credits'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const useAdminUsers = (options?: UseAdminUsersOptions) => {
  const queryClient = useQueryClient();
  const {
    search = '',
    includeDeleted = false,
    role,
    plan,
    isOnboarded,
    sortBy,
    sortOrder,
    limit,
    offset,
  } = options || {};

  // Get all users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery<{ users: User[]; totalCount: number; pagination?: { totalPages: number } }>({
    queryKey: [
      'admin-users',
      search,
      includeDeleted,
      role,
      plan,
      isOnboarded,
      sortBy,
      sortOrder,
      limit,
      offset,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      if (includeDeleted) {
        params.append('includeDeleted', 'true');
      }
      if (role) {
        params.append('role', role);
      }
      if (plan) {
        params.append('plan', plan);
      }
      if (isOnboarded) {
        params.append('isOnboarded', isOnboarded);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (sortOrder) {
        params.append('sortOrder', sortOrder);
      }
      if (limit) {
        params.append('limit', limit.toString());
      }
      if (offset) {
        params.append('offset', offset.toString());
      }
      const response = await axios.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    },
  });

  const users = usersData?.users || [];
  const totalCount = usersData?.totalCount || 0;
  const pagination = usersData?.pagination;

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await axios.post('/admin/users', userData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
    },
    onError: () => {
      // Error toast is already shown by axios interceptor
      // Just invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: UpdateUserData }) => {
      const response = await axios.put(`/admin/users/${userId}`, userData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
    },
    onError: () => {
      // Error toast is already shown by axios interceptor
      // Just invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await axios.delete(`/admin/users/${userId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      // Error toast is already shown by axios interceptor
      // Just invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Restore user mutation
  const restoreUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await axios.post(`/admin/users/${userId}/restore`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User restored successfully');
    },
    onError: () => {
      // Error toast is already shown by axios interceptor
      // Just invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return {
    users,
    totalCount,
    pagination,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    restoreUser: restoreUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isRestoring: restoreUserMutation.isPending,
  };
};
