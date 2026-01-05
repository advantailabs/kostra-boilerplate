import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { authApi } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface OTPVerificationData {
  email: string;
  name: string;
  password: string;
  otp: string;
}

export function useOTPVerification() {
  const { setAuth } = useAuthStore();
  const { closeModal } = useSignInModalContext();

  return useApiMutation({
    mutationFn: async (data: OTPVerificationData) => {
      const response = await authApi.verifySignup(data);
      return response;
    },
    onSuccess: response => {
      const { user, token } = response;

      // Update auth store
      setAuth(user, token);

      toast.success('Account created successfully!');
      closeModal();
    },
    onError: (error: unknown) => {
      const castedError = error as AxiosError<{ message: string }>;
      toast.error(castedError.response?.data?.message ?? 'Failed to verify OTP');
    },
  });
}
