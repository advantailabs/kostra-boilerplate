export interface File {
  id: number;
  userId: number | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string | null;
  metadata: any;
  openaiFileId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
