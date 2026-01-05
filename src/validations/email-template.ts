import { z } from 'zod';

// Email type enum validation
const emailTypeEnum = z.enum(['TRANSACTIONAL', 'PROMOTIONAL']);

// Variables validation - should be an array of strings, default to empty array
const variablesSchema = z.array(z.string()).default([]);

export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be 200 characters or less'),
  fromEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'From email must be 255 characters or less'),
  fromName: z
    .string()
    .min(1, 'From name is required')
    .max(100, 'From name must be 100 characters or less'),
  replyToEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Reply-to email must be 255 characters or less')
    .optional()
    .or(z.literal('')),
  emailType: emailTypeEnum.default('TRANSACTIONAL'),
  body: z.string().min(1, 'Body is required'),
  variables: variablesSchema,
});

export const updateEmailTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be 200 characters or less')
    .optional(),
  fromEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'From email must be 255 characters or less')
    .optional(),
  fromName: z
    .string()
    .min(1, 'From name is required')
    .max(100, 'From name must be 100 characters or less')
    .optional(),
  replyToEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Reply-to email must be 255 characters or less')
    .optional(),
  emailType: emailTypeEnum.optional(),
  body: z.string().min(1, 'Body is required').optional(),
  variables: variablesSchema,
});

// Type exports for TypeScript
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
