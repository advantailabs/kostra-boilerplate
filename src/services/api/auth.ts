import axios from '@/lib/axios';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    profilePicture: string | null;
    role: string;
    isOnboarded: boolean;
    credits?: number; // Make credits optional
    plan?: string;
    isOverdue?: boolean;
    planExpiringAt?: string | null;
  };
  token: string;
}

export const getAuth = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>('/auth');
  // Standardized API returns { success: true, data: { user, token } }
  return (response.data as any).data as AuthResponse;
};

export const googleSignIn = async (credential: string): Promise<AuthResponse> => {
  const response = await axios.post('/auth/google/verify', {
    credential,
  });
  // Standardized API returns { success: true, data: { user, token } }
  return (response.data as any).data as AuthResponse;
};

export const logout = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};
