import { Message, PrismaClient } from '@prisma/client';

import { CreateMessageData } from '@/types/chat';

const prisma = new PrismaClient();

const createMessage = async (data: CreateMessageData): Promise<Message> => {
  return prisma.message.create({
    data: {
      threadId: data.threadId,
      role: data.role,
      content: data.content,
    },
  });
};

const findByThreadId = async (threadId: number): Promise<Message[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
};

const findById = async (messageId: number): Promise<Message | null> => {
  return prisma.message.findUnique({
    where: { id: messageId },
  });
};

const findLatestByThreadId = async (threadId: number): Promise<Message | null> => {
  return prisma.message.findFirst({
    where: {
      threadId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
};

const findMessagesByThreadAndRole = async (
  threadId: number,
  role: 'user' | 'assistant'
): Promise<Message[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
      role,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
};

const deleteMessage = async (messageId: number): Promise<void> => {
  await prisma.message.delete({
    where: { id: messageId },
  });
};

const deleteMessagesByThreadId = async (threadId: number): Promise<void> => {
  await prisma.message.deleteMany({
    where: {
      threadId,
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
};
