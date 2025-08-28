import { logout } from '@/services/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: logout,
  });

  return mutation;
};
