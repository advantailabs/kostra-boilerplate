import { z } from 'zod';

export const createPackageSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  isFeatured: z.boolean().optional(),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  currencySymbol: z
    .string()
    .min(1, { message: 'Currency symbol is required' })
    .max(4, { message: 'Currency symbol must be 1-4 characters' }),
  features: z.array(z.string()).default([]),
});

export const updatePackageSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  isFeatured: z.boolean().optional(),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  currencySymbol: z
    .string()
    .min(1, { message: 'Currency symbol is required' })
    .max(4, { message: 'Currency symbol must be 1-4 characters' }),
  features: z.array(z.string()).default([]),
});

export const packageIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const packageFiltersSchema = z
  .object({
    title: z.string().optional(),
    isFeatured: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  })
  .strict(); // Fails validation if additional keys are present in input

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
export type PackageIdParam = z.infer<typeof packageIdSchema>;
export type PackageFilters = z.infer<typeof packageFiltersSchema>;
