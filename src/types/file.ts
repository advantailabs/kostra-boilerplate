export interface File {
  id: number;
  userId: number | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
