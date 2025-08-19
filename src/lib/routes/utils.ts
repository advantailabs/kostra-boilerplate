/**
 * Route matching and utility functions
 */

import { ALL_ROUTES } from './config';
import { HttpMethod, RouteConfig } from './types';

/**
 * Compiles a route pattern into a regular expression
 */
export function compileRoutePattern(pattern: string): RegExp {
  // Split path into segments
  const segments = pattern.split('/').filter(Boolean);

  // Process each segment
  const regexSegments = segments.map(segment => {
    // Next-style [id] or Express-style :id
    if (/^\[.+\]$/.test(segment) || /^:.+/.test(segment)) {
      return '[^/]+';
    }
    // Escape regular expression special characters
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  const regexStr = `^/${regexSegments.join('/')}$`;
  return new RegExp(regexStr);
}

/**
 * Checks if a path matches a route pattern
 */
export function matchRoute(path: string, route: RouteConfig): boolean {
  const regex = compileRoutePattern(route.path);
  return regex.test(path);
}

/**
 * Checks if a request is for a public route
 */
export function isPublicRoute(request: Request): boolean {
  const url = new URL(request.url);
  const path = url.pathname;
  return ALL_ROUTES.some(route => matchRoute(path, route) && route.isPublic);
}

/**
 * Checks if a route is configured in the system
 */
export function isRouteConfigured(path: string): boolean {
  return ALL_ROUTES.some(route => matchRoute(path, route));
}

/**
 * Finds a matching route configuration for a given path
 */
export function findMatchingRoute(path: string): RouteConfig | undefined {
  return ALL_ROUTES.find(route => matchRoute(path, route));
}

/**
 * Checks if a route requires role-based access for a specific method
 */
export function requiresRoleAccess(route: RouteConfig | undefined, method: string): boolean {
  return !!route?.accessTo?.[method as Exclude<HttpMethod, null>];
}
