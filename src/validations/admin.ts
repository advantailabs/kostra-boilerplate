import { z } from 'zod';

import { ROLES } from '@/lib/constants/admin';

// Schema for creating a new user (admin operation)
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be 255 characters or less'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or less')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Invalid password format'
    ),
  role: z
    .enum([ROLES.ADMIN, ROLES.USER], {
      errorMap: () => ({ message: 'Role must be either "admin" or "user"' }),
    })
    .transform(val => (val === 'ADMIN' ? ROLES.ADMIN : ROLES.USER)),
});

// Schema for updating a user (admin operation)
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be 255 characters or less')
    .optional(),
  role: z
    .enum([ROLES.ADMIN, ROLES.USER], {
      errorMap: () => ({ message: `Role must be either "${ROLES.ADMIN}" or "${ROLES.USER}"` }),
    })
    .optional(),
  isOnboarded: z.boolean().optional(),
  credits: z.number().min(0, 'Credits cannot be negative').optional(),
  stripeCustomerId: z
    .string()
    .max(255, 'Stripe Customer ID must be 255 characters or less')
    .optional(),
  plan: z.enum(['FREE', 'PRO']).optional(),
  isOverDue: z.boolean().optional(),
  planExpiringAt: z.string().datetime().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be 128 characters or less')
    .optional(),
});

// Schema for validating user ID parameter
export const userIdParamSchema = z.object({
  id: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^\d+$/, 'User ID must be a valid number')
    .transform(val => parseInt(val, 10)),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
