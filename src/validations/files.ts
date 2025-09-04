import { z } from 'zod';

export const getFilesSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => parseInt(val || '1', 10)),
  limit: z
    .string()
    .optional()
    .transform(val => parseInt(val || '20', 10)),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'size', 'mimeType']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  personaId: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  mimeType: z.string().optional(),
});

export const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      originalName: z.string(),
      mimeType: z.string(),
      size: z.number(),
      s3Key: z.string(),
      uploadPurpose: z
        .enum(['PersonaLogo', 'UserAvatar', 'MessageAttachment', 'UserDocument'])
        .optional(),
    })
  ),
});

export const updateFileSchema = z.object({
  originalName: z.string().optional(),
});
