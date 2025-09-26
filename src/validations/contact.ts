import { z } from 'zod';

// These enums mirror the Prisma enums but avoid importing '@prisma/client' into client bundles
const contactPurposeEnum = z.enum([
  'ACCOUNT',
  'BILLING',
  'TECHNICAL_SUPPORT',
  'FEATURE_REQUEST',
  'BUG_REPORT',
  'GENERAL_INQUIRY',
  'OTHER',
]);

const contactStatusEnum = z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less'),
  purpose: contactPurposeEnum,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or less'),
});

export const contactSubmissionUpdateSchema = z.object({
  status: contactStatusEnum.optional(),
  adminNotes: z.string().max(1000, 'Admin notes must be 1000 characters or less').optional(),
  // Accept either Date or ISO string; transform ISO string to Date during parsing
  resolvedAt: z
    .union([z.date(), z.string().datetime()])
    .optional()
    .transform(val => {
      if (!val) return undefined;
      return typeof val === 'string' ? new Date(val) : val;
    }),
});

export const contactSubmissionFiltersSchema = z.object({
  status: contactStatusEnum.optional(),
  purpose: contactPurposeEnum.optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactSubmissionUpdate = z.infer<typeof contactSubmissionUpdateSchema>;
export type ContactSubmissionFilters = z.infer<typeof contactSubmissionFiltersSchema>;
