'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { siteConfig } from '@/app/siteConfig';
import Spinner from '@/components/atom/Spinner';
import { getAuth } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
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
    // Run on mount to check for existing auth, but only once
    enabled: true,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
    // Prevent multiple calls when not authenticated
    retryOnMount: false,
    // Add cache time to prevent unnecessary refetches
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

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
