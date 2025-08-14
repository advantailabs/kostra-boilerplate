import axios from '@/lib/axios';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    profilePicture: string | null;
    role: string;
    isOnboarded: boolean;
    credits: number;
  };
  token: string;
}

export const getAuth = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>('/auth');
  // Standardized API returns { success: true, data: { user, token } }
  return (response.data as any).data as AuthResponse;
};
