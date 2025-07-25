import { PrismaClient, Thread } from '@prisma/client';

import {
  CreateThreadData,
  ThreadWithMessages,
  ThreadWithPersona,
  UpdateThreadData,
} from '@/types/chat';

const defaultPrisma = new PrismaClient();

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
): Promise<ThreadWithPersona[]> => {
  return prisma.thread.findMany({
    where: {
      userId,
      deletedAt: null, // Only fetch non-deleted threads
    },
    include: {
      persona: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

const findByIdWithMessages = async (
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

const findById = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread | null> => {
  return prisma.thread.findUnique({
    where: { id: threadId },
  });
};

const findByUserAndId = async (
  userId: number,
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Thread | null> => {
  return prisma.thread.findFirst({
    where: {
      id: threadId,
      userId,
      deletedAt: null, // Only fetch non-deleted threads
    },
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
  findByUserAndId,
  findByUserId,
  hardDeleteThread,
  restoreThread,
  updateThread,
  updateThreadOpenAIId,
  updateThreadTimestamp
};

