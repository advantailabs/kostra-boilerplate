import { axios } from '@/lib/utils';

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
  const response = await axios.get<{ data: AuthResponse }>('/auth');
  // Standardized API returns { success: true, data: { user, token } }
  if (!response.data.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as AuthResponse;
};

export const googleSignIn = async (credential: string): Promise<AuthResponse> => {
  const response = await axios.post('/auth/google/verify', {
    credential,
  });
  // Standardized API returns { success: true, data: { user, token } }
  console.log(response.data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as AuthResponse;
};

export const logout = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const response = await axios.post('/auth/login', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as AuthResponse;
};

export const signup = async (data: { email: string }): Promise<{ message: string }> => {
  const response = await axios.post('/auth/signup', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as { message: string };
};

export const verifySignup = async (data: {
  email: string;
  name: string;
  password: string;
  otp: string;
}): Promise<AuthResponse> => {
  const response = await axios.post('/auth/verify-signup', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as AuthResponse;
};

export const resendOTP = async (data: {
  email: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET';
}): Promise<{ message: string }> => {
  const response = await axios.post('/auth/resend-otp', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as { message: string };
};

export const forgotPassword = async (data: { email: string }): Promise<{ message: string }> => {
  const response = await axios.post('/auth/forgot-password', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as { message: string };
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
  otp: string;
}): Promise<{ message: string }> => {
  const response = await axios.post('/auth/reset-password', data);
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as { message: string };
};

export const authApi = {
  getAuth,
  googleSignIn,
  logout,
  login,
  signup,
  verifySignup,
  resendOTP,
  forgotPassword,
  resetPassword,
};
