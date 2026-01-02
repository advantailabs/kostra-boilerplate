import { authApi } from '@/services/api/auth';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface ForgotPasswordData {
  email: string;
}

export function useForgotPassword() {
  const mutation = useApiMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await authApi.forgotPassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Password reset code sent to your email!');
    },
    onError: (error: unknown) => {
      const castedError = error as AxiosError<{ message: string }>;
      toast.error(castedError.response?.data?.message ?? 'Failed to send password reset code');
    },
  });

  const forgotPassword = async (data: ForgotPasswordData) => {
    return mutation.mutateAsync(data);
  };

  return {
    forgotPassword,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
