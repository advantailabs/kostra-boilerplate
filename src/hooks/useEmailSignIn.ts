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

  const mutation = useApiMutation({
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
    onError: (error: unknown) => {
      // Attempt to extract a message safely, otherwise use the fallback
      let message = 'Failed to sign in';
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      toast.error(message);
    },
  });

  const signIn = async (data: EmailSignInData) => {
    return mutation.mutateAsync(data);
  };

  return {
    signIn,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
