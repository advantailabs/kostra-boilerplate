import { authApi } from '@/services/api/auth';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface ForgotPasswordData {
  email: string;
}

export function useForgotPassword() {
  return useApiMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await authApi.forgotPassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Password reset code sent to your email!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send password reset code');
    },
  });
}
