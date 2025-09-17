/**
 * Hook for route protection and role-based access control
 */

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { validateRouteAccess } from '@/lib/routes/route-protection';
import { UserRole } from '@/lib/routes/types';
import { useAuthStore } from '@/store/auth';

/**
 * Hook to protect routes based on user role and authentication status
 */
export function useRouteProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAuthenticated = !!user;
  const userRole = user?.role as UserRole | null;

  useEffect(() => {
    const validation = validateRouteAccess(pathname, userRole, isAuthenticated);

    if (!validation.canAccess && validation.redirectTo) {
      router.push(validation.redirectTo);
    }
  }, [pathname, userRole, isAuthenticated, router]);

  return {
    isAuthenticated,
    userRole,
    canAccessCurrentRoute: validateRouteAccess(pathname, userRole, isAuthenticated).canAccess,
  };
}

/**
 * Hook to check if user can access a specific route
 */
export function useCanAccessRoute(route: string) {
  const { user } = useAuthStore();
  const userRole = user?.role as UserRole | null;

  return validateRouteAccess(route, userRole, !!user).canAccess;
}
