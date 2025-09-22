import { useSignInModalContext } from '@/providers/SignInModalProvider';
import { authApi } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { useApiMutation } from './useApiMutation';

interface EmailSignInData {
  email: string;
  password: string;
}

export function useEmailSignIn() {
  const { setAuth } = useAuthStore();
  const { closeModal } = useSignInModalContext();

  return useApiMutation({
    mutationFn: async (data: EmailSignInData) => {
      const response = await authApi.login(data);
      return response;
    },
    onSuccess: response => {
      const { user, token } = response;

      // Update auth store
      setAuth(user, token);

      toast.success('Successfully signed in!');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to sign in');
    },
  });
}
