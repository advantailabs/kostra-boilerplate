/**
 * Permission and authentication logic
 */

import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { HttpMethod, ROLES_LIST, USER, UserRole } from './types';
import { findMatchingRoute } from './utils';

/**
 * Verifies a JWT token and returns its payload
 */
export async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extracts and validates user role from request headers
 */
export async function checkUserRoleStatus(request: NextRequest): Promise<UserRole | null> {
  const authHeader = request.headers.get('x-custom-token');
  const token = authHeader?.replace('Bearer ', '');
  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded.role === 'string') {
      const role = decoded.role.toUpperCase() as UserRole;
      return ROLES_LIST.includes(role) ? role : null;
    }
  }
  return null;
}

/**
 * Checks if a user has access to a specific path and method
 */
export function checkAccess(path: string, method: string, userRole: UserRole): boolean {
  const route = findMatchingRoute(path);

  if (!route) return false;

  // If the route is public, it's accessible
  if (route.isPublic) {
    return true;
  }

  // Check if the method has role-based access control
  if (route.accessTo) {
    const allowed = route.accessTo[method as Exclude<HttpMethod, null>];
    if (allowed) return allowed.includes(userRole);
  }

  return false;
}

/**
 * Gets the effective user role, defaulting to USER if none provided
 */
export function getEffectiveUserRole(userRole: UserRole | null): UserRole {
  return userRole || USER;
}
