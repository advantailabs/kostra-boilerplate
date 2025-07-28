import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: number; // Database user ID
  clerkUserId: string;
  email: string;
  name: string;
  profilePicture: string | null;
  role: string;
  isOnboarded: boolean;
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
      setAuth: (user: User, token: string) => set(() => ({ user, token })),
      clearAuth: () => set(() => ({ user: null, token: null })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
