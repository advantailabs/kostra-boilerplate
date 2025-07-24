import { z } from 'zod';

export const createThreadSchema = z.object({
  personaId: z.number().int().positive('Persona ID must be a positive integer'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be 5000 characters or less'),
});

export const addMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(5000, 'Message must be 5000 characters or less'),
});

export type CreateThreadRequest = z.infer<typeof createThreadSchema>;
export type AddMessageRequest = z.infer<typeof addMessageSchema>;
