import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { authApi } from '@/services/api/auth';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface ResetPasswordData {
  email: string;
  newPassword: string;
  otp: string;
}

export function useResetPassword() {
  const { closeModal } = useSignInModalContext();

  const mutation = useApiMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await authApi.resetPassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Password reset successfully! Please sign in with your new password.');
      closeModal();
    },
    onError: (error: unknown) => {
      const castedError = error as AxiosError<{ message: string }>;
      toast.error(castedError.response?.data?.message ?? 'Failed to reset password');
    },
  });

  const resetPassword = async (data: ResetPasswordData) => {
    return mutation.mutateAsync(data);
  };

  return {
    resetPassword,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
