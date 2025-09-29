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
}

export const useAdminUsers = (options?: UseAdminUsersOptions) => {
  const queryClient = useQueryClient();
  const { search = '' } = options || {};

  // Get all users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      const response = await axios.get(`/admin/users?${params.toString()}`);
      return response.data.data.users;
    },
  });

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
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create user';
      toast.error(errorMessage);
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
    onError: (error: Error) => {
      toast.error(error.message);
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
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    users: users || [],
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
