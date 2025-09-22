import { authApi } from '@/services/api/auth';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface EmailSignUpData {
  email: string;
}

export function useEmailSignUp() {
  return useApiMutation({
    mutationFn: async (data: EmailSignUpData) => {
      const response = await authApi.signup(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Verification code sent to your email!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send verification code');
    },
  });
}
