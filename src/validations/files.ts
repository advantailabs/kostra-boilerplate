import { z } from 'zod';

// Image MIME types that are not supported by OpenAI vector store
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

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
  knowledgeBaseId: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  personaId: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  mimeType: z.string().optional(),
});

export const uploadFilesSchema = z
  .object({
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
    knowledgeBaseIds: z.array(z.number()).optional(),
  })
  .refine(
    data => {
      // If knowledge base IDs are provided, check that no image files are included
      if (data.knowledgeBaseIds && data.knowledgeBaseIds.length > 0) {
        const imageFiles = data.files.filter(file =>
          IMAGE_MIME_TYPES.includes(file.mimeType.toLowerCase())
        );

        if (imageFiles.length > 0) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Image files (JPG, PNG, SVG, WebP, etc.) cannot be uploaded to knowledge bases.',
      path: ['files'],
    }
  );

export const updateFileSchema = z.object({
  originalName: z.string().optional(),
  knowledgeBaseIds: z.array(z.number()).optional(),
});

export const knowledgeBaseActionSchema = z.object({
  knowledgeBaseId: z.number(),
});
