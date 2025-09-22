import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { authApi } from '@/services/api/auth';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface ResetPasswordData {
  email: string;
  newPassword: string;
  otp: string;
}

export function useResetPassword() {
  const { closeModal } = useSignInModalContext();

  return useApiMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await authApi.resetPassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Password reset successfully! Please sign in with your new password.');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password');
    },
  });
}
