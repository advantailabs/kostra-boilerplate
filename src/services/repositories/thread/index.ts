import { PrismaClient, Thread } from '@prisma/client';

import {
  CreateThreadData,
  ThreadWithMessages,
  ThreadWithPersona,
  UpdateThreadData,
} from '@/types/chat';

const prisma = new PrismaClient();

const createThread = async (data: CreateThreadData): Promise<Thread> => {
  return prisma.thread.create({
    data: {
      userId: data.userId,
      personaId: data.personaId,
      title: data.title,
    },
  });
};

const findByUserId = async (userId: number): Promise<ThreadWithPersona[]> => {
  return prisma.thread.findMany({
    where: {
      userId,
    },
    include: {
      persona: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

const findByIdWithMessages = async (threadId: number): Promise<ThreadWithMessages | null> => {
  return prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      messages: {
        orderBy: {
          timestamp: 'asc',
        },
      },
      persona: true,
    },
  });
};

const findById = async (threadId: number): Promise<Thread | null> => {
  return prisma.thread.findUnique({
    where: { id: threadId },
  });
};

const findByUserAndId = async (userId: number, threadId: number): Promise<Thread | null> => {
  return prisma.thread.findFirst({
    where: {
      id: threadId,
      userId,
    },
  });
};

const updateThread = async (threadId: number, data: UpdateThreadData): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.personaId && { personaId: data.personaId }),
      updatedAt: new Date(),
    },
  });
};

const deleteThread = async (threadId: number): Promise<void> => {
  await prisma.thread.delete({
    where: { id: threadId },
  });
};

const updateThreadTimestamp = async (threadId: number): Promise<Thread> => {
  return prisma.thread.update({
    where: { id: threadId },
    data: {
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
  updateThread,
  updateThreadTimestamp,
};
