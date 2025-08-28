import { googleSignIn } from '@/services/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useGoogleSignIn = () => {
  const mutation = useMutation({
    mutationFn: googleSignIn,
  });

  return mutation;
};
