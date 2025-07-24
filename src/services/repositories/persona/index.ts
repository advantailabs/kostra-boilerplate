import { Persona, PrismaClient } from '@prisma/client';

import { CreatePersonaData, PersonaWithUser, UpdatePersonaData } from '@/types/chat';

const prisma = new PrismaClient();

const createPersona = async (data: CreatePersonaData): Promise<Persona> => {
  return prisma.persona.create({
    data: {
      userId: data.userId,
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      tags: data.tags,
    },
  });
};

const findActiveByUserId = async (userId: number): Promise<Persona[]> => {
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

const findById = async (id: number): Promise<Persona | null> => {
  return prisma.persona.findUnique({
    where: { id },
  });
};

const findByIdWithUser = async (id: number): Promise<PersonaWithUser | null> => {
  return prisma.persona.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
};

const updatePersona = async (id: number, data: UpdatePersonaData): Promise<Persona> => {
  return prisma.persona.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.instructions && { instructions: data.instructions }),
      ...(data.tags && { tags: data.tags }),
      updatedAt: new Date(),
    },
  });
};

const softDeletePersona = async (id: number): Promise<Persona> => {
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
  personaId: number
): Promise<Persona | null> => {
  return prisma.persona.findFirst({
    where: {
      id: personaId,
      userId,
      deletedAt: null,
    },
  });
};

const restorePersona = async (id: number): Promise<Persona> => {
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
  findByIdWithUser,
  findPersonaByUserAndId,
  restorePersona,
  softDeletePersona,
  updatePersona,
};
