import { PrismaClient, Thread } from '@prisma/client';

import {
  CreateThreadData,
  PublicThread,
  PublicThreadWithMessages,
  PublicThreadWithPersona,
  ThreadWithMessages,
  UpdateThreadData,
} from '@/types/chat';

const defaultPrisma = new PrismaClient();

// Select object to exclude OpenAI fields from public responses
const publicThreadSelect = {
  id: true,
  userId: true,
  personaId: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  // Explicitly exclude openaiThreadId
};

const createThread = async (
  data: CreateThreadData,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread> => {
  return prisma.thread.create({
    data: {
      userId: data.userId,
      personaId: data.personaId,
      title: data.title,
    },
  });
};

const findByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicThreadWithPersona[]> => {
  return prisma.thread.findMany({
    where: {
      userId,
      deletedAt: null, // Only fetch non-deleted threads
    },
    select: {
      ...publicThreadSelect,
      persona: {
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
    orderBy: {
      updatedAt: 'desc',
    },
  }) as any;
};

// Internal function that includes OpenAI fields for backend operations
const findByIdWithMessagesInternal = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<ThreadWithMessages | null> => {
  return prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      messages: {
        where: {
          deletedAt: null, // Only fetch non-deleted messages
        },
        orderBy: {
          timestamp: 'asc',
        },
      },
      persona: true,
    },
  });
};

// Public function that excludes OpenAI fields from responses
const findByIdWithMessages = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicThreadWithMessages | null> => {
  return prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    select: {
      ...publicThreadSelect,
      messages: {
        where: {
          deletedAt: null, // Only fetch non-deleted messages
        },
        select: {
          id: true,
          threadId: true,
          role: true,
          content: true,
          timestamp: true,
          citations: true,
          deletedAt: true,
          // Explicitly exclude openaiMessageId
        },
        orderBy: {
          timestamp: 'asc',
        },
      },
      persona: {
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
  }) as any;
};

const findById = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicThread | null> => {
  return prisma.thread.findUnique({
    where: { id: threadId },
    select: publicThreadSelect,
  });
};

const findByUserAndId = async (
  userId: number,
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicThread | null> => {
  return prisma.thread.findFirst({
    where: {
      id: threadId,
      userId,
      deletedAt: null, // Only fetch non-deleted threads
    },
    select: publicThreadSelect,
  });
};

const findByUserAndIdIncludingDeleted = async (
  userId: number,
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicThread | null> => {
  return prisma.thread.findFirst({
    where: {
      id: threadId,
      userId,
    },
    select: publicThreadSelect,
  });
};

const updateThread = async (
  threadId: number,
  data: UpdateThreadData,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.personaId && { personaId: data.personaId }),
      updatedAt: new Date(),
    },
  });
};

const deleteThread = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.thread.update({
    where: { id: threadId },
    data: {
      deletedAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const hardDeleteThread = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.thread.delete({
    where: { id: threadId },
  });
};

const restoreThread = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
      deletedAt: null,
      updatedAt: new Date(),
    },
  });
};

const updateThreadTimestamp = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
      updatedAt: new Date(),
    },
  });
};

const updateThreadOpenAIId = async (
  threadId: number,
  openaiThreadId: string,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
      openaiThreadId,
      updatedAt: new Date(),
    },
  });
};

export {
  createThread,
  deleteThread,
  findById,
  findByIdWithMessages,
  findByIdWithMessagesInternal,
  findByUserAndId,
  findByUserAndIdIncludingDeleted,
  findByUserId,
  hardDeleteThread,
  restoreThread,
  updateThread,
  updateThreadOpenAIId,
  updateThreadTimestamp,
};
