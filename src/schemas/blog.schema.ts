import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.string().min(1, { message: 'Tags are required' }),
  categories: z.string().min(1, { message: 'Categories are required' }),
  blogImageUrl: z.string().optional(),
  published: z.string().optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  tags: z.string().min(1, { message: 'Tags are required' }),
  categories: z.string().min(1, { message: 'Categories are required' }),
  blogImageUrl: z.string().optional(),
  published: z.string().optional(),
  authorId: z.string().optional(),
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
