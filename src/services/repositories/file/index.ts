import { File, PrismaClient } from '@prisma/client';
import { RepositoryResult } from '../../../types/chat';

const prisma = new PrismaClient();

export interface CreateFileData {
  userId: number;
  openaiFileId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  metadata?: any;
}

export interface UpdateFileData {
  openaiFileId?: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  metadata?: any;
}

export interface FileWithKnowledgeBases extends File {
  fileKnowledgeBases: {
    knowledgeBase: {
      id: number;
      title: string;
      description: string;
      personas: {
        id: number;
        name: string;
        description: string;
        logo: string | null;
      }[];
    };
  }[];
}

export interface FileFilters {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'size' | 'mimeType';
  sortOrder?: 'asc' | 'desc';
  knowledgeBaseId?: number;
  personaId?: number;
  mimeType?: string;
}

export async function createFile(data: CreateFileData): Promise<RepositoryResult<File>> {
  try {
    const file = await prisma.file.create({
      data: {
        userId: data.userId,
        openaiFileId: data.openaiFileId,
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

export async function findFileById(
  id: number
): Promise<RepositoryResult<FileWithKnowledgeBases | null>> {
  try {
    const file = await prisma.file.findFirst({
      where: { id, deletedAt: null },
      include: {
        fileKnowledgeBases: {
          include: {
            knowledgeBase: {
              include: {
                personas: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    logo: true,
                  },
                },
              },
            },
          },
        },
      },
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
): Promise<RepositoryResult<{ files: FileWithKnowledgeBases[]; total: number }>> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
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

    // Handle knowledge base and persona filtering
    if (filters?.knowledgeBaseId || filters?.personaId) {
      const fileKnowledgeBasesCondition: any = {
        some: {},
      };

      if (filters?.knowledgeBaseId) {
        fileKnowledgeBasesCondition.some.knowledgeBaseId = filters.knowledgeBaseId;
      }

      if (filters?.personaId) {
        fileKnowledgeBasesCondition.some.knowledgeBase = {
          personas: {
            some: {
              id: filters.personaId,
            },
          },
        };
      }

      whereClause.fileKnowledgeBases = fileKnowledgeBasesCondition;
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      orderBy = { [filters.sortBy]: filters.sortOrder || 'desc' };
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where: whereClause,
        include: {
          fileKnowledgeBases: {
            include: {
              knowledgeBase: {
                include: {
                  personas: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      logo: true,
                    },
                  },
                },
              },
            },
          },
        },
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

export async function permanentlyDeleteFile(id: number): Promise<RepositoryResult<void>> {
  try {
    // Delete file knowledge base associations first
    await prisma.fileKnowledgeBase.deleteMany({
      where: { fileId: id },
    });

    // Delete the file
    await prisma.file.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error permanently deleting file:', error);
    return { success: false, error: 'Failed to permanently delete file' };
  }
}

export async function addFileToKnowledgeBase(
  fileId: number,
  knowledgeBaseId: number
): Promise<RepositoryResult<void>> {
  try {
    await prisma.fileKnowledgeBase.create({
      data: {
        fileId,
        knowledgeBaseId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding file to knowledge base:', error);
    return { success: false, error: 'Failed to add file to knowledge base' };
  }
}

export async function removeFileFromKnowledgeBase(
  fileId: number,
  knowledgeBaseId: number
): Promise<RepositoryResult<void>> {
  try {
    await prisma.fileKnowledgeBase.delete({
      where: {
        fileId_knowledgeBaseId: {
          fileId,
          knowledgeBaseId,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing file from knowledge base:', error);
    return { success: false, error: 'Failed to remove file from knowledge base' };
  }
}
