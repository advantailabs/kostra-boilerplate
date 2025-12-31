import { InputJsonValue, JsonValue } from '@prisma/client/runtime/client';

export interface File {
  id: number;
  userId: number | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string | null;
  metadata: InputJsonValue | JsonValue;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
