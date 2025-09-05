import { prisma as sharedPrisma } from '@/lib/prisma';
import { Persona, PrismaClient } from '@prisma/client';

import {
  CreatePersonaData,
  PublicPersona,
  PublicPersonaWithUser,
  UpdatePersonaData,
} from '@/types/chat';

const defaultPrisma = sharedPrisma as PrismaClient;

// Select object to exclude OpenAI fields from public responses
const publicPersonaSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  instructions: true,
  tags: true,
  logo: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  // Explicitly exclude openaiAssistantId
};

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
    },
  });
};

const findActiveByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicPersona[]> => {
  return prisma.persona.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: publicPersonaSelect,
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const findActiveByUserIdWithFiles = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicPersona[]> => {
  return prisma.persona.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      ...publicPersonaSelect,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as any;
};

// Internal function that includes OpenAI fields for backend operations
const findByIdInternal = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Persona | null> => {
  return prisma.persona.findUnique({
    where: { id },
  });
};

// Public function that excludes OpenAI fields from responses
const findById = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicPersona | null> => {
  return prisma.persona.findUnique({
    where: { id },
    select: publicPersonaSelect,
  });
};

const findByIdWithUser = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicPersonaWithUser | null> => {
  return prisma.persona.findUnique({
    where: { id },
    select: {
      ...publicPersonaSelect,
      user: true,
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
): Promise<PublicPersona | null> => {
  return prisma.persona.findFirst({
    where: {
      id: personaId,
      userId,
      deletedAt: null,
    },
    select: publicPersonaSelect,
  });
};

// Internal version that includes OpenAI fields
const findPersonaByUserAndIdInternal = async (
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
  findActiveByUserIdWithFiles,
  findById,
  findByIdInternal,
  findByIdWithUser,
  findPersonaByUserAndId,
  findPersonaByUserAndIdInternal,
  restorePersona,
  softDeletePersona,
  updatePersona,
};
