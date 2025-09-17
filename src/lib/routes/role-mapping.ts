/**
 * Role-based route mapping and navigation configuration
 */

import { siteConfig } from '@/app/siteConfig';
import { ADMIN, USER, UserRole } from './types';

/**
 * Navigation item interface for role-based access control
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: any; // Icon component type
  section: string;
  roles: UserRole[]; // Roles that can access this navigation item
}

/**
 * Role-based navigation configuration
 * Each navigation item specifies which roles can access it
 */
export const ROLE_BASED_NAVIGATION: NavigationItem[] = [
  // Persona section - accessible to both USER and ADMIN
  {
    name: 'Home',
    href: siteConfig.baseLinks.home,
    icon: null, // Will be imported in components
    section: 'Persona',
    roles: [USER, ADMIN],
  },
  {
    name: 'Personas',
    href: siteConfig.baseLinks.personas,
    icon: null, // Will be imported in components
    section: 'Persona',
    roles: [USER, ADMIN],
  },
  {
    name: 'Files',
    href: siteConfig.baseLinks.files,
    icon: null, // Will be imported in components
    section: 'Persona',
    roles: [USER, ADMIN],
  },
  
  // Admin section - accessible only to ADMIN
  {
    name: 'Blogs',
    href: siteConfig.baseLinks.blogs,
    icon: null, // Will be imported in components
    section: 'Admin',
    roles: [ADMIN],
  },
  {
    name: 'Categories',
    href: siteConfig.baseLinks.categories,
    icon: null, // Will be imported in components
    section: 'Admin',
    roles: [ADMIN],
  },
  {
    name: 'Users',
    href: siteConfig.baseLinks.admin.users,
    icon: null, // Will be imported in components
    section: 'Admin',
    roles: [ADMIN],
  },
] as const;

/**
 * Route access mapping for role-based protection
 * Maps routes to the roles that can access them
 */
export const ROUTE_ACCESS_MAP: Record<string, UserRole[]> = {
  // App routes - accessible to both USER and ADMIN
  [siteConfig.baseLinks.home]: [USER, ADMIN],
  [siteConfig.baseLinks.personas]: [USER, ADMIN],
  [siteConfig.baseLinks.files]: [USER, ADMIN],
  [siteConfig.baseLinks.creditHistory]: [USER, ADMIN],
  [siteConfig.baseLinks.settings.general]: [USER, ADMIN],
  [siteConfig.baseLinks.settings.billing]: [USER, ADMIN],
  [siteConfig.baseLinks.settings.users]: [USER, ADMIN],
  
  // Admin-only routes
  [siteConfig.baseLinks.blogs]: [ADMIN],
  [siteConfig.baseLinks.categories]: [ADMIN],
  [siteConfig.baseLinks.admin.dashboard]: [ADMIN],
  [siteConfig.baseLinks.admin.users]: [ADMIN],
  
  // Onboarding - accessible to both USER and ADMIN
  [siteConfig.baseLinks.onboarding]: [USER, ADMIN],
} as const;

/**
 * Checks if a user role has access to a specific route
 */
export function hasRouteAccess(route: string, userRole: UserRole | null): boolean {
  if (!userRole) return false;
  
  // Check exact match first
  if (ROUTE_ACCESS_MAP[route]) {
    return ROUTE_ACCESS_MAP[route].includes(userRole);
  }
  
  // Check for dynamic routes (e.g., /app/settings/[tab])
  for (const [routePattern, allowedRoles] of Object.entries(ROUTE_ACCESS_MAP)) {
    if (routeMatches(route, routePattern)) {
      return allowedRoles.includes(userRole);
    }
  }
  
  return false;
}

/**
 * Checks if a route matches a pattern (for dynamic routes)
 */
function routeMatches(route: string, pattern: string): boolean {
  // Simple pattern matching for dynamic routes
  // This can be enhanced for more complex patterns
  const routeSegments = route.split('/');
  const patternSegments = pattern.split('/');
  
  if (routeSegments.length !== patternSegments.length) {
    return false;
  }
  
  return patternSegments.every((segment, index) => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      // Dynamic segment - matches any value
      return true;
    }
    return segment === routeSegments[index];
  });
}

/**
 * Gets navigation items filtered by user role
 */
export function getNavigationForRole(userRole: UserRole | null): NavigationItem[] {
  if (!userRole) return [];
  
  return ROLE_BASED_NAVIGATION.filter(item => 
    item.roles.includes(userRole)
  );
}

/**
 * Gets navigation items grouped by section for a specific role
 */
export function getNavigationBySection(userRole: UserRole | null): Record<string, NavigationItem[]> {
  const navigationItems = getNavigationForRole(userRole);
  
  return navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);
}
