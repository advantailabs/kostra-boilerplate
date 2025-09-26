import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  purpose: z.enum(
    [
      'ACCOUNT',
      'BILLING',
      'TECHNICAL_SUPPORT',
      'FEATURE_REQUEST',
      'BUG_REPORT',
      'GENERAL_INQUIRY',
      'OTHER',
    ],
    {
      errorMap: () => ({ message: 'Invalid purpose selected' }),
    }
  ),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(2000, { message: 'Message must be less than 2000 characters' }),
});

// Contact filters validation schema
export const contactFiltersSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  purpose: z
    .enum([
      'ACCOUNT',
      'BILLING',
      'TECHNICAL_SUPPORT',
      'FEATURE_REQUEST',
      'BUG_REPORT',
      'GENERAL_INQUIRY',
      'OTHER',
    ])
    .optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Contact update validation schema
export const contactUpdateSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  adminNotes: z
    .string()
    .max(1000, { message: 'Admin notes must be less than 1000 characters' })
    .optional(),
  resolvedAt: z.string().datetime().optional().or(z.null()),
});

// Contact ID validation schema
export const contactIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactFilters = z.infer<typeof contactFiltersSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
export type ContactIdParam = z.infer<typeof contactIdSchema>;
