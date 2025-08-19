/**
 * Types for route configuration and permission management
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | null;

export const ROLES_LIST = ['ADMIN', 'USER'] as const;

export type UserRole = (typeof ROLES_LIST)[number];

export type MethodAccess = Partial<Record<Exclude<HttpMethod, null>, UserRole[]>>;

export interface RouteConfig {
  path: string; // Use exact patterns with optional [slug] segments
  isPublic: boolean; // true if route is public, false if requires authentication
  accessTo?: MethodAccess; // role-gated per method (only for non-public routes)
}

export const ROLES = ROLES_LIST.reduce(
  (acc, role) => {
    acc[role] = role;
    return acc;
  },
  {} as Record<UserRole, UserRole>
);

export const { ADMIN, USER } = ROLES;
