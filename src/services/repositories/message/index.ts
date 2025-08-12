import { Message, PrismaClient } from '@prisma/client';

import { CreateMessageData, PublicMessage, StoredCitation } from '@/types/chat';

const defaultPrisma = new PrismaClient();

// Select object to exclude OpenAI fields from public responses
const publicMessageSelect = {
  id: true,
  threadId: true,
  role: true,
  content: true,
  timestamp: true,
  citations: true,
  deletedAt: true,
  // Explicitly exclude openaiMessageId
};

const createMessage = async (
  data: CreateMessageData,
  prisma: PrismaClient = defaultPrisma
): Promise<Message> => {
  return prisma.message.create({
    data: {
      threadId: data.threadId,
      role: data.role,
      content: data.content,
      openaiMessageId: data.openaiMessageId,
    },
  });
};

const createMessageWithCitations = async (
  data: CreateMessageData & { citations?: StoredCitation[] },
  prisma: PrismaClient = defaultPrisma
): Promise<Message> => {
  return prisma.message.create({
    data: {
      threadId: data.threadId,
      role: data.role,
      content: data.content,
      openaiMessageId: data.openaiMessageId,
      citations: data.citations ? JSON.stringify(data.citations) : undefined,
    },
  });
};

// Link files to a message via MessageFile join table
const addFilesToMessage = async (
  messageId: number,
  fileIds: number[],
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  if (!fileIds || fileIds.length === 0) return;

  const anyPrisma: any = prisma as any;
  const hasDelegate =
    anyPrisma.messageFile && typeof anyPrisma.messageFile.createMany === 'function';

  if (hasDelegate) {
    await anyPrisma.messageFile.createMany({
      data: fileIds.map(fileId => ({ messageId, fileId })),
      skipDuplicates: true,
    });
    return;
  }

  // Fallback for environments where the delegate is not present
  const values = fileIds.map(fileId => `(${Number(messageId)}, ${Number(fileId)})`).join(',');
  if (values.length > 0) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "MessageFile" ("messageId", "fileId") VALUES ${values} ON CONFLICT ("messageId", "fileId") DO NOTHING;`
    );
  }
};

const findByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicMessage[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
      deletedAt: null, // Only fetch non-deleted messages
    },
    select: publicMessageSelect,
    orderBy: {
      timestamp: 'asc',
    },
  });
};

const findById = async (
  messageId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicMessage | null> => {
  return prisma.message.findUnique({
    where: { id: messageId },
    select: publicMessageSelect,
  });
};

const findLatestByThreadId = async (
  threadId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicMessage | null> => {
  return prisma.message.findFirst({
    where: {
      threadId,
      deletedAt: null, // Only fetch non-deleted messages
    },
    select: publicMessageSelect,
    orderBy: {
      timestamp: 'desc',
    },
  });
};

const findMessagesByThreadAndRole = async (
  threadId: number,
  role: 'user' | 'assistant',
  prisma: PrismaClient = defaultPrisma
): Promise<PublicMessage[]> => {
  return prisma.message.findMany({
    where: {
      threadId,
      role,
      deletedAt: null, // Only fetch non-deleted messages
    },
    select: publicMessageSelect,
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
  addFilesToMessage,
  createMessage,
  createMessageWithCitations,
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
