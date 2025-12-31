import { prisma as sharedPrisma } from '@/lib/prisma';
import { File, PrismaClient } from '@/lib/prisma/generated/client';
import {
  FileOrderByWithRelationInput,
  FileWhereInput,
  InputJsonValue,
} from '@/lib/prisma/generated/internal/prismaNamespace';
import type { File as FileType } from '@/types/file';
import { JsonValue } from '@prisma/client/runtime/client';

// Repository result type
interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const prisma = sharedPrisma as PrismaClient;

// Select object for public file responses
const publicFileSelect = {
  id: true,
  userId: true,
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export interface CreateFileData {
  userId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  metadata?: InputJsonValue;
}

export interface UpdateFileData {
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  metadata?: InputJsonValue;
}

export interface FileFilters {
  search?: string;
  sortBy?: 'originalName' | 'createdAt' | 'size' | 'mimeType';
  sortOrder?: 'asc' | 'desc';
  mimeType?: string;
}

export async function createFile(data: CreateFileData): Promise<RepositoryResult<File>> {
  try {
    const file = await prisma.file.create({
      data: {
        userId: data.userId,
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        url: data.url,
        metadata: data.metadata,
      },
    });

    return { success: true, data: file };
  } catch (error) {
    console.error('Error creating file:', error);
    return { success: false, error: 'Failed to create file' };
  }
}

// Internal function for backend operations
export async function findFileByIdInternal(id: number): Promise<RepositoryResult<File | null>> {
  try {
    const file = await prisma.file.findFirst({
      where: { id, deletedAt: null },
    });

    return { success: true, data: file };
  } catch (error) {
    console.error('Error finding file:', error);
    return { success: false, error: 'Failed to find file' };
  }
}

// Public function for client responses
export async function findFileById(
  id: number
): Promise<RepositoryResult<(Omit<FileType, 'metadata'> & { metadata: JsonValue }) | null>> {
  try {
    const file = await prisma.file.findFirst({
      where: { id, deletedAt: null },
      select: publicFileSelect,
    });

    return { success: true, data: file };
  } catch (error) {
    console.error('Error finding file:', error);
    return { success: false, error: 'Failed to find file' };
  }
}

export async function findFilesByUserId(
  userId: number,
  page = 1,
  limit = 20,
  filters?: FileFilters
): Promise<RepositoryResult<{ files: FileType[]; total: number }>> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: FileWhereInput = {
      userId,
      deletedAt: null,
    };

    if (filters?.search) {
      whereClause.originalName = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters?.mimeType) {
      whereClause.mimeType = filters.mimeType;
    }

    // Build order by clause
    let orderBy: FileOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy) {
      orderBy = { [filters.sortBy]: filters.sortOrder || 'desc' };
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where: whereClause,
        select: publicFileSelect,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.file.count({ where: whereClause }),
    ]);

    return { success: true, data: { files, total } };
  } catch (error) {
    console.error('Error finding files by user ID:', error);
    return { success: false, error: 'Failed to find files' };
  }
}

export async function updateFile(
  id: number,
  data: UpdateFileData
): Promise<RepositoryResult<File>> {
  try {
    const file = await prisma.file.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: file };
  } catch (error) {
    console.error('Error updating file:', error);
    return { success: false, error: 'Failed to update file' };
  }
}

export async function deleteFile(id: number): Promise<RepositoryResult<void>> {
  try {
    await prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

export async function getTotalFilesCount(userId: number): Promise<RepositoryResult<number>> {
  try {
    const total = await prisma.file.count({ where: { userId, deletedAt: null } });
    return { success: true, data: total };
  } catch (error) {
    console.error('Error getting total files count:', error);
    return { success: false, error: 'Failed to get total files count' };
  }
}
