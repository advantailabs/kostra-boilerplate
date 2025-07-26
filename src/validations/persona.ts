import { z } from 'zod';

export const createPersonaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  instructions: z
    .string()
    .min(1, 'Instructions are required')
    .max(2000, 'Instructions must be 2000 characters or less'),
  tags: z
    .array(
      z.string().min(1, 'Tags cannot be empty').max(50, 'Each tag must be 50 characters or less')
    )
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
  logo: z.string().optional(),
});

export const updatePersonaSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  instructions: z
    .string()
    .min(1, 'Instructions are required')
    .max(2000, 'Instructions must be 2000 characters or less')
    .optional(),
  tags: z
    .array(
      z.string().min(1, 'Tags cannot be empty').max(50, 'Each tag must be 50 characters or less')
    )
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  logo: z.string().optional(),
});

export type CreatePersonaRequest = z.infer<typeof createPersonaSchema>;
export type UpdatePersonaRequest = z.infer<typeof updatePersonaSchema>;
