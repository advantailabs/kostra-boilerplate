import axios from '@/lib/axios';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    isOnboarded: boolean;
  };
  token: string;
}

export const getAuth = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>('/auth');
  return response.data;
};
