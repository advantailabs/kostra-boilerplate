'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { siteConfig } from '@/app/siteConfig';
import Spinner from '@/components/atom/Spinner';
import { getAuth } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading } = useQuery({
    queryKey: ['auth', token],
    queryFn: async () => {
      try {
        const data = await getAuth();
        if (data.user && data.token) {
          setAuth(data.user, data.token);
        } else {
          throw new Error('Invalid auth response');
        }
        return data;
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    enabled: !!token, // Only run if we have a token
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  // Check for token in cookies on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getAuth();
        if (data.user && data.token) {
          setAuth(data.user, data.token);
        }
      } catch (error) {
        clearAuth();
      }
    };

    if (!token) {
      checkAuth();
    }
  }, [token, setAuth, clearAuth]);

  // Redirect to onboarding if not onboarded
  useEffect(() => {
    if (
      user &&
      user.isOnboarded === false &&
      pathname !== siteConfig.baseLinks.onboarding &&
      pathname !== '/'
    ) {
      router.replace(siteConfig.baseLinks.onboarding);
    }
    // If onboarded and on onboarding page, redirect to overview
    if (user && user.isOnboarded === true && pathname === '/onboarding') {
      router.replace(siteConfig.baseLinks.home);
    }
  }, [user, pathname, router]);

  // Show loading state while fetching auth data
  if (isLoading) {
    return (
      <div className="bg-background flex h-screen w-screen items-center justify-center">
        <Spinner size="md" color="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
