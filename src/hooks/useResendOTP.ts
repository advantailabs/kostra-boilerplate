import { authApi } from '@/services/api/auth';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface ResendOTPData {
  email: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET';
}

export function useResendOTP() {
  const mutation = useApiMutation({
    mutationFn: async (data: ResendOTPData) => {
      const response = await authApi.resendOTP(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Verification code sent to your email!');
    },
    onError: (error: unknown) => {
      const castedError = error as AxiosError<{ message: string }>;
      toast.error(castedError.response?.data?.message ?? 'Failed to resend verification code');
    },
  });

  const resendOTP = async (data: ResendOTPData) => {
    return mutation.mutateAsync(data);
  };

  return {
    resendOTP,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
