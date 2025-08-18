import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { clearCreditsValue, setCreditsValue } from './credits';

interface User {
  id: string; // Database user ID
  email: string;
  name: string;
  profilePicture: string | null;
  role: string;
  isOnboarded: boolean;
  credits: number;
  plan?: string;
  isOverdue?: boolean;
  planExpiringAt?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (_user: User, _token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setAuth: (user: User, token: string) => {
        set(() => ({ user, token }));
        // Sync credits with the credit store when user data is set
        setCreditsValue(user.credits);
      },
      clearAuth: () => {
        set(() => ({ user: null, token: null }));
        // Clear credits when user logs out
        clearCreditsValue();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
