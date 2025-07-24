'use client';

import { useSession, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { siteConfig } from '@/app/siteConfig';
import Spinner from '@/components/atom/Spinner';
import { getAuth } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const { session } = useSession();
  const { setAuth, clearAuth, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading } = useQuery({
    queryKey: ['auth', session?.id],
    queryFn: async () => {
      try {
        if (!session) {
          throw new Error('No session available');
        }
        const token = await session.getToken();
        if (!token) {
          throw new Error('No token available');
        }
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
    enabled: isSignedIn && isLoaded && !!session,
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  // Clear auth if user is not signed in
  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      clearAuth();
    }
  }, [isSignedIn, isLoaded, clearAuth]);

  // Redirect to onboarding if not onboarded
  useEffect(() => {
    if (
      isSignedIn &&
      isLoaded &&
      user &&
      user.isOnboarded === false &&
      pathname !== siteConfig.baseLinks.onboarding &&
      pathname !== '/'
    ) {
      router.replace(siteConfig.baseLinks.onboarding);
    }
    // If onboarded and on onboarding page, redirect to overview
    if (isSignedIn && isLoaded && user && user.isOnboarded === true && pathname === '/onboarding') {
      router.replace(siteConfig.baseLinks.home);
    }
  }, [isSignedIn, isLoaded, user, pathname, router]);

  // Show loading state while Clerk is loading or while fetching auth data
  if (!isLoaded || isLoading) {
    return (
      <div className="bg-background flex h-screen w-screen items-center justify-center">
        <Spinner size="md" color="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
