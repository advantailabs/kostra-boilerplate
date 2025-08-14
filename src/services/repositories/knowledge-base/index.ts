import { FileKnowledgeBase, KnowledgeBase, PrismaClient } from '@prisma/client';
import {
  CreateKnowledgeBaseData,
  KnowledgeBaseWithFiles,
  RepositoryResult,
  UpdateKnowledgeBaseData,
} from '../../../types/chat';

import { prisma as sharedPrisma } from '@/lib/prisma';

// eslint-disable-next-line import/newline-after-import

const prisma = sharedPrisma as PrismaClient;

// Select object to exclude OpenAI fields from public responses
const publicKnowledgeBaseSelect = {
  id: true,
  userId: true,
  title: true,
  description: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  // Explicitly exclude vectorStoreId
};

export async function createKnowledgeBase(
  data: CreateKnowledgeBaseData
): Promise<RepositoryResult<KnowledgeBase>> {
  try {
    const knowledgeBase = await prisma.knowledgeBase.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        metadata: data.metadata,
        vectorStoreId: data.vectorStoreId,
      },
    });

    return { success: true, data: knowledgeBase };
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    return { success: false, error: 'Failed to create knowledge base' };
  }
}

export async function findKnowledgeBaseById(
  id: number
): Promise<RepositoryResult<KnowledgeBaseWithFiles | null>> {
  try {
    const knowledgeBase = await prisma.knowledgeBase.findFirst({
      where: { id, deletedAt: null },
      include: {
        fileKnowledgeBases: {
          where: { file: { deletedAt: null } },
          include: {
            file: {
              select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                size: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        personas: {
          where: { deletedAt: null },
        },
      },
    });

    return { success: true, data: knowledgeBase };
  } catch (error) {
    console.error('Error finding knowledge base:', error);
    return { success: false, error: 'Failed to find knowledge base' };
  }
}

// Public version that excludes vectorStoreId
export async function findKnowledgeBaseByIdPublic(
  id: number
): Promise<RepositoryResult<KnowledgeBaseWithFiles | null>> {
  try {
    const knowledgeBase = await prisma.knowledgeBase.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...publicKnowledgeBaseSelect,
        fileKnowledgeBases: {
          where: { file: { deletedAt: null } },
          include: {
            file: {
              select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                size: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        personas: {
          where: { deletedAt: null },
          select: {
            id: true,
            userId: true,
            name: true,
            description: true,
            instructions: true,
            tags: true,
            logo: true,
            knowledgeBaseId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            // Explicitly exclude openaiAssistantId
          },
        },
      },
    });

    return { success: true, data: knowledgeBase as any };
  } catch (error) {
    console.error('Error finding knowledge base:', error);
    return { success: false, error: 'Failed to find knowledge base' };
  }
}

export async function findKnowledgeBasesByUserId(
  userId: number
): Promise<RepositoryResult<KnowledgeBaseWithFiles[]>> {
  try {
    const knowledgeBases = await prisma.knowledgeBase.findMany({
      where: { userId, deletedAt: null },
      include: {
        fileKnowledgeBases: {
          where: { file: { deletedAt: null } },
          include: {
            file: {
              select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                size: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        personas: {
          where: { deletedAt: null },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: knowledgeBases };
  } catch (error) {
    console.error('Error finding knowledge bases by user:', error);
    return { success: false, error: 'Failed to find knowledge bases' };
  }
}

// Public version that excludes vectorStoreId
export async function findKnowledgeBasesByUserIdPublic(
  userId: number
): Promise<RepositoryResult<KnowledgeBaseWithFiles[]>> {
  try {
    const knowledgeBases = await prisma.knowledgeBase.findMany({
      where: { userId, deletedAt: null },
      select: {
        ...publicKnowledgeBaseSelect,
        fileKnowledgeBases: {
          where: { file: { deletedAt: null } },
          include: {
            file: {
              select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                size: true,
                url: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        personas: {
          where: { deletedAt: null },
          select: {
            id: true,
            userId: true,
            name: true,
            description: true,
            instructions: true,
            tags: true,
            logo: true,
            knowledgeBaseId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            // Explicitly exclude openaiAssistantId
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: knowledgeBases as any };
  } catch (error) {
    console.error('Error finding knowledge bases by user:', error);
    return { success: false, error: 'Failed to find knowledge bases' };
  }
}

export async function updateKnowledgeBase(
  id: number,
  data: UpdateKnowledgeBaseData
): Promise<RepositoryResult<KnowledgeBase>> {
  try {
    const knowledgeBase = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        metadata: data.metadata,
        vectorStoreId: data.vectorStoreId,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: knowledgeBase };
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return { success: false, error: 'Failed to update knowledge base' };
  }
}

export async function deleteKnowledgeBase(
  id: number,
  deleteFiles: boolean = false
): Promise<
  RepositoryResult<{
    deleted: boolean;
    filesToDelete?: Array<{ fileId: number; openaiFileId: string | null }>;
    vectorStoreId?: string | null;
  }>
> {
  try {
    let filesToDelete: Array<{ fileId: number; openaiFileId: string | null }> = [];
    let vectorStoreId: string | null = null;

    // Get the knowledge base to access vectorStoreId
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
      select: { vectorStoreId: true },
    });

    vectorStoreId = knowledgeBase?.vectorStoreId || null;

    if (deleteFiles) {
      // Get all files in this knowledge base
      const fileKnowledgeBases = await prisma.fileKnowledgeBase.findMany({
        where: { knowledgeBaseId: id },
        include: { file: true },
      });

      // Collect file information for vector store deletion
      filesToDelete = fileKnowledgeBases.map(fkb => ({
        fileId: fkb.fileId,
        openaiFileId: fkb.file.openaiFileId,
      }));

      // Get all file IDs for bulk update
      const fileIds = fileKnowledgeBases.map(fkb => fkb.fileId);

      // Bulk update all files to mark as deleted
      if (fileIds.length > 0) {
        await prisma.file.updateMany({
          where: { id: { in: fileIds } },
          data: { deletedAt: new Date() },
        });
      }

      // Delete all file-knowledge base relationships
      await prisma.fileKnowledgeBase.deleteMany({
        where: { knowledgeBaseId: id },
      });
    }

    // Soft delete the knowledge base
    await prisma.knowledgeBase.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      data: {
        deleted: true,
        filesToDelete: deleteFiles ? filesToDelete : undefined,
        vectorStoreId,
      },
    };
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
    return { success: false, error: 'Failed to delete knowledge base' };
  }
}

export async function addFileToKnowledgeBase(
  knowledgeBaseId: number,
  fileId: number
): Promise<RepositoryResult<FileKnowledgeBase>> {
  try {
    const fileKnowledgeBase = await prisma.fileKnowledgeBase.create({
      data: {
        knowledgeBaseId,
        fileId,
      },
    });

    return { success: true, data: fileKnowledgeBase };
  } catch (error) {
    console.error('Error adding file to knowledge base:', error);
    return { success: false, error: 'Failed to add file to knowledge base' };
  }
}

export async function removeFileFromKnowledgeBase(
  knowledgeBaseId: number,
  fileId: number
): Promise<RepositoryResult<boolean>> {
  try {
    await prisma.fileKnowledgeBase.delete({
      where: {
        fileId_knowledgeBaseId: {
          fileId,
          knowledgeBaseId,
        },
      },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error('Error removing file from knowledge base:', error);
    return { success: false, error: 'Failed to remove file from knowledge base' };
  }
}

export async function getKnowledgeBaseFiles(
  knowledgeBaseId: number
): Promise<RepositoryResult<any[]>> {
  try {
    const files = await prisma.fileKnowledgeBase.findMany({
      where: {
        knowledgeBaseId,
        file: { deletedAt: null },
      },
      include: {
        file: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            url: true,
            metadata: true,
          },
        },
      },
    });

    return { success: true, data: files.map(f => f.file) };
  } catch (error) {
    console.error('Error getting files for knowledge base:', error);
    return { success: false, error: 'Failed to get files for knowledge base' };
  }
}
