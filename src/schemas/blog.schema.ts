import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
  blogImageUrl: z.string().optional(),
  published: z.boolean().optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
  blogImageUrl: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.number().optional(),
});

export const blogIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const blogFiltersSchema = z.object({
  title: z.string().optional(),
  published: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogIdParam = z.infer<typeof blogIdSchema>;
export type BlogFilters = z.infer<typeof blogFiltersSchema>;
