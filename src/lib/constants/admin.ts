/**
 * Admin-related constants
 */

export interface Role {
  value: string;
  label: string;
}

/**
 * Role type definitions
 */
export type UserRole = 'ADMIN' | 'USER';

/**
 * Role constants to avoid hardcoding
 */
export const ROLES = {
  ADMIN: 'ADMIN' as const,
  USER: 'USER' as const,
} as const;

/**
 * Available admin roles for user management
 * Simplified to Admin/User only for this application
 */
export const ADMIN_ROLES: Role[] = [
  {
    value: ROLES.ADMIN,
    label: 'Admin',
  },
  {
    value: ROLES.USER,
    label: 'User',
  },
];
