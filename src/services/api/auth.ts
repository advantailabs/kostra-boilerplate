import axios from '@/lib/axios';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    profilePicture: string | null;
    role: string;
    isOnboarded: boolean;
  };
  token: string;
}

export const getAuth = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>('/auth');
  return response.data;
};
