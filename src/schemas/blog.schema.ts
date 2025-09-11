import { z } from 'zod';

const validateImageFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  return allowedTypes.includes(file?.type) && file.size <= maxSize;
};

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
  blogImageUrl: z.string().optional(),
  published: z.boolean().optional(),
});

export const createBlogSchemaFrontend = createBlogSchema.extend({
  imageFile: z.optional(z.any()),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
  blogImageUrl: z.string().optional(),
  published: z.boolean().optional(),
});

export const updateBlogSchemaFrontend = updateBlogSchema.extend({
  imageFile: z
    .any()
    .optional()
    .refine(file => file === undefined || file === null || file instanceof File, {
      message: 'Invalid file format',
    })
    .refine(file => file === undefined || file === null || validateImageFile(file), {
      message: 'File must be JPG or PNG format and under 5MB',
    }),
});

export const blogIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const blogFiltersSchema = z.object({
  title: z.string().optional(),
  published: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogIdParam = z.infer<typeof blogIdSchema>;
export type BlogFilters = z.infer<typeof blogFiltersSchema>;
