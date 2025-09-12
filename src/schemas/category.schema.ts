import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  slug: z.string().min(1, { message: 'Category slug is required' }),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  slug: z.string().min(1, { message: 'Category slug is required' }),
});

export const categoryIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const categoryFiltersSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdSchema>;
export type CategoryFilters = z.infer<typeof categoryFiltersSchema>;
