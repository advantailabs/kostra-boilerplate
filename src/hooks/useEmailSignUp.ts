import { authApi } from '@/services/api/auth';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface EmailSignUpData {
  email: string;
}

export function useEmailSignUp() {
  const mutation = useApiMutation({
    mutationFn: async (data: EmailSignUpData) => {
      const response = await authApi.signup(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Verification code sent to your email!');
    },
    onError: (error: unknown) => {
      const castedError = error as AxiosError<{ message: string }>;
      toast.error(castedError.response?.data?.message ?? 'Failed to send verification code');
    },
  });

  const signUp = async (data: EmailSignUpData) => {
    return mutation.mutateAsync(data);
  };

  return {
    signUp,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
