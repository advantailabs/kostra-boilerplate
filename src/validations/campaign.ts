import { z } from 'zod';

// Campaign status enum validation
const campaignStatusEnum = z.enum(['SCHEDULED', 'SENT', 'FAILED', 'PARTIALLYSUCCESS']);

// Campaign recipient status enum validation
const campaignRecipientStatusEnum = z.enum(['PENDING', 'SENT', 'FAILED', 'OPENED', 'CLICKED']);

// Campaign creation schema
export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  emailTemplateId: z.number().int().positive('Email template ID must be a positive integer'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  status: campaignStatusEnum.default('SCHEDULED'),
  scheduledAt: z
    .string()
    .datetime('Invalid scheduled date format')
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  recipients: z
    .array(z.number().int().positive('User ID must be a positive integer'))
    .min(1, 'At least one recipient is required'),
});

// Campaign update schema
export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less')
    .optional(),
  emailTemplateId: z
    .number()
    .int()
    .positive('Email template ID must be a positive integer')
    .optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  status: campaignStatusEnum.optional(),
  scheduledAt: z
    .string()
    .datetime('Invalid scheduled date format')
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  recipients: z.array(z.number().int().positive('User ID must be a positive integer')).optional(),
});

// Campaign recipient creation schema
export const createCampaignRecipientSchema = z.object({
  campaignId: z.number().int().positive('Campaign ID must be a positive integer'),
  userId: z.number().int().positive('User ID must be a positive integer'),
  status: campaignRecipientStatusEnum.default('PENDING'),
  emailBody: z.string().optional(),
});

// Campaign recipient update schema
export const updateCampaignRecipientSchema = z.object({
  status: campaignRecipientStatusEnum.optional(),
  emailBody: z.string().optional(),
  sentAt: z
    .string()
    .datetime('Invalid sent date format')
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  openedAt: z
    .string()
    .datetime('Invalid opened date format')
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  clickedAt: z
    .string()
    .datetime('Invalid clicked date format')
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
});

// ID validation schemas
export const campaignIdSchema = z.object({
  id: z.string().refine(val => !Number.isNaN(parseInt(val, 10)), {
    message: 'Campaign ID must be a valid number',
  }),
});

export const campaignRecipientIdSchema = z.object({
  id: z.string().refine(val => !Number.isNaN(parseInt(val, 10)), {
    message: 'Campaign recipient ID must be a valid number',
  }),
});

// Type exports for TypeScript
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CreateCampaignRecipientInput = z.infer<typeof createCampaignRecipientSchema>;
export type UpdateCampaignRecipientInput = z.infer<typeof updateCampaignRecipientSchema>;
