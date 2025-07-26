import { Message, PrismaClient } from '@prisma/client';

import { CreateMessageData } from '@/types/chat';

const defaultPrisma = new PrismaClient();

const createMessage = async (
  data: CreateMessageData,
  prisma: PrismaClient = defaultPrisma
): Promise<Message> => {
  return prisma.message.create({
    data: {
      threadId: data.threadId,
      role: data.role,
      content: data.content,
    },
  });
};

const findByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Message[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
      deletedAt: null, // Only fetch non-deleted messages
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
};

const findById = async (
  messageId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Message | null> => {
  return prisma.message.findUnique({
    where: { id: messageId },
  });
};

const findLatestByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Message | null> => {
  return prisma.message.findFirst({
    where: {
      threadId,
      deletedAt: null, // Only fetch non-deleted messages
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
};

const findMessagesByThreadAndRole = async (
  threadId: number,
  role: 'user' | 'assistant',
  prisma: PrismaClient = defaultPrisma
): Promise<Message[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
      role,
      deletedAt: null, // Only fetch non-deleted messages
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
};

const deleteMessage = async (
  messageId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.message.update({
    where: { id: messageId },
    data: {
      deletedAt: new Date(),
    },
  });
};

const deleteMessagesByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.message.updateMany({
    where: {
      threadId,
      deletedAt: null, // Only soft delete non-deleted messages
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

const hardDeleteMessage = async (
  messageId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.message.delete({
    where: { id: messageId },
  });
};

const hardDeleteMessagesByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.message.deleteMany({
    where: {
      threadId,
    },
  });
};

const restoreMessage = async (
  messageId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Message> => {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      deletedAt: null,
    },
  });
};

const restoreMessagesByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  await prisma.message.updateMany({
    where: {
      threadId,
    },
    data: {
      deletedAt: null,
    },
  });
};

export {
  createMessage,
  deleteMessage,
  deleteMessagesByThreadId,
  findById,
  findByThreadId,
  findLatestByThreadId,
  findMessagesByThreadAndRole,
  hardDeleteMessage,
  hardDeleteMessagesByThreadId,
  restoreMessage,
  restoreMessagesByThreadId,
};
