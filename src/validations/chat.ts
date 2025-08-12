import { z } from 'zod';

export const createThreadSchema = z.object({
  personaId: z.number().int().positive('Persona ID must be a positive integer'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be 5000 characters or less'),
  files: z
    .array(
      z.object({
        originalName: z.string().min(1),
        mimeType: z.string().min(1),
        size: z.number().int().nonnegative(),
        s3Key: z.string().min(1),
        uploadPurpose: z
          .enum([
            'PersonaLogo',
            'UserAvatar',
            'UserFile',
            'ThreadAttachment',
            'MessageAttachment',
            'UserDocument',
          ])
          .optional(),
      })
    )
    .optional(),
});

export const addMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(5000, 'Message must be 5000 characters or less'),
  files: z
    .array(
      z.object({
        originalName: z.string().min(1),
        mimeType: z.string().min(1),
        size: z.number().int().nonnegative(),
        s3Key: z.string().min(1),
        uploadPurpose: z
          .enum([
            'PersonaLogo',
            'UserAvatar',
            'UserFile',
            'ThreadAttachment',
            'MessageAttachment',
            'UserDocument',
          ])
          .optional(),
      })
    )
    .optional(),
});

export type CreateThreadRequest = z.infer<typeof createThreadSchema>;
export type AddMessageRequest = z.infer<typeof addMessageSchema>;
