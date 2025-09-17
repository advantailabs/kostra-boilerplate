/**
 * Route protection utilities for role-based access control
 */

import { siteConfig } from '@/app/siteConfig';
import { hasRouteAccess } from './role-mapping';
import { UserRole } from './types';

/**
 * Checks if a user can access a specific route
 */
export function canAccessRoute(route: string, userRole: UserRole | null): boolean {
  return hasRouteAccess(route, userRole);
}

/**
 * Gets the redirect URL for unauthorized access
 * Returns the landing page for unauthorized users
 */
export function getUnauthorizedRedirectUrl(): string {
  return siteConfig.baseLinks.landing;
}

/**
 * Checks if a route requires authentication
 */
export function requiresAuthentication(route: string): boolean {
  // Routes that don't require authentication
  const publicRoutes = [
    siteConfig.baseLinks.landing,
    siteConfig.baseLinks.privacy,
    siteConfig.baseLinks.terms,
    '/sitemap.xml',
    '/robots.txt',
  ];

  // Check if route is public
  if (publicRoutes.includes(route)) {
    return false;
  }

  // Check for public API routes
  if (
    route.startsWith('/api/webhooks/') ||
    route.startsWith('/api/auth/') ||
    route.startsWith('/favicon') ||
    route.startsWith('/_next/') ||
    route.startsWith('/images/') ||
    route.startsWith('/logos/') ||
    route.startsWith('/screenshots/')
  ) {
    return false;
  }

  return true;
}

/**
 * Validates route access and returns redirect information if unauthorized
 */
export function validateRouteAccess(
  route: string,
  userRole: UserRole | null,
  isAuthenticated: boolean
): { canAccess: boolean; redirectTo?: string } {
  // If route doesn't require authentication, allow access
  if (!requiresAuthentication(route)) {
    return { canAccess: true };
  }

  // If user is not authenticated, redirect to home
  if (!isAuthenticated) {
    return { canAccess: false, redirectTo: getUnauthorizedRedirectUrl() };
  }

  // If user is authenticated but doesn't have role access, redirect to home
  if (!canAccessRoute(route, userRole)) {
    return { canAccess: false, redirectTo: getUnauthorizedRedirectUrl() };
  }

  return { canAccess: true };
}
