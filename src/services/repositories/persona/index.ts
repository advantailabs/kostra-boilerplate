import { Persona, PrismaClient } from '@prisma/client';

import {
  CreatePersonaData,
  PersonaWithKnowledgeBase,
  PersonaWithUser,
  UpdatePersonaData,
} from '@/types/chat';

const defaultPrisma = new PrismaClient();

const createPersona = async (
  data: CreatePersonaData,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona> => {
  return prisma.persona.create({
    data: {
      userId: data.userId,
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      tags: data.tags,
      logo: data.logo,
      openaiAssistantId: data.openaiAssistantId,
      knowledgeBaseId: data.knowledgeBaseId,
    },
  });
};

const findActiveByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona[]> => {
  return prisma.persona.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const findById = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona | null> => {
  return prisma.persona.findUnique({
    where: { id },
  });
};

const findByIdWithUser = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PersonaWithUser | null> => {
  return prisma.persona.findUnique({
    where: { id },
    include: {
      user: true,
      knowledgeBase: true,
    },
  });
};

const findByIdWithKnowledgeBase = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PersonaWithKnowledgeBase | null> => {
  return prisma.persona.findUnique({
    where: { id },
    include: {
      knowledgeBase: {
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
                },
              },
            },
          },
        },
      },
    },
  });
};

const updatePersona = async (
  id: number,
  data: UpdatePersonaData,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona> => {
  return prisma.persona.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.instructions && { instructions: data.instructions }),
      ...(data.tags && { tags: data.tags }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.knowledgeBaseId !== undefined && { knowledgeBaseId: data.knowledgeBaseId }),
      updatedAt: new Date(),
    },
  });
};

const softDeletePersona = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona> => {
  return prisma.persona.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const findPersonaByUserAndId = async (
  userId: number,
  personaId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona | null> => {
  return prisma.persona.findFirst({
    where: {
      id: personaId,
      userId,
      deletedAt: null,
    },
  });
};

const restorePersona = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona> => {
  return prisma.persona.update({
    where: { id },
    data: {
      deletedAt: null,
      updatedAt: new Date(),
    },
  });
};

export {
  createPersona,
  findActiveByUserId,
  findById,
  findByIdWithKnowledgeBase,
  findByIdWithUser,
  findPersonaByUserAndId,
  restorePersona,
  softDeletePersona,
  updatePersona,
};
