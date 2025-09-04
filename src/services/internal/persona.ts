import { Persona, PrismaClient } from '@prisma/client';

import {
    createPersona,
    findActiveByUserIdWithFiles,
    findById,
    findPersonaByUserAndId,
    findPersonaByUserAndIdInternal,
    softDeletePersona,
    updatePersona,
} from '@/services/repositories/persona';
import {
    CreatePersonaData,
    PublicPersona,
    UpdatePersonaData,
} from '@/types/chat';

export interface PersonaServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const createPersonaService = async (
  userId: number,
  data: CreatePersonaData,
  prisma?: PrismaClient
): Promise<PersonaServiceResult<Persona>> => {
  try {
    // Create persona
    const persona = await createPersona(
      {
        userId,
        name: data.name.trim(),
        description: data.description.trim(),
        instructions: data.instructions.trim(),
        tags: data.tags?.map(tag => tag.trim()) || [],
        logo: data.logo,
      },
      prisma
    );

    return {
      success: true,
      data: persona,
    };
  } catch (error) {
    console.error('Error in createPersonaService:', error);
    return {
      success: false,
      error: 'Failed to create persona',
    };
  }
};

const getUserPersonasService = async (
  userId: number,
  prisma?: PrismaClient
): Promise<PersonaServiceResult<PublicPersona[]>> => {
  try {
    const personas = await findActiveByUserIdWithFiles(userId, prisma);
    return {
      success: true,
      data: personas,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch personas',
    };
  }
};

const getPersonaByIdService = async (
  personaId: number,
  prisma?: PrismaClient
): Promise<PersonaServiceResult<PublicPersona>> => {
  try {
    const persona = await findById(personaId, prisma);

    if (!persona || persona.deletedAt) {
      return {
        success: false,
        error: 'Persona not found',
      };
    }

    return {
      success: true,
      data: persona,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch persona',
    };
  }
};

const updatePersonaService = async (
  userId: number,
  personaId: number,
  data: UpdatePersonaData,
  prisma?: PrismaClient
): Promise<PersonaServiceResult<PublicPersona>> => {
  try {
    // Check if persona exists and belongs to user
    const existingPersona = await findPersonaByUserAndIdInternal(userId, personaId, prisma);

    if (!existingPersona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    await updatePersona(
      personaId,
      {
        name: data.name?.trim(),
        description: data.description?.trim(),
        instructions: data.instructions?.trim(),
        tags: data.tags?.map(tag => tag.trim()),
        logo: data.logo,
      },
      prisma
    );

    // Fetch the updated persona
    const updatedPersona = await findById(personaId, prisma);

    return {
      success: true,
      data: updatedPersona!,
    };
  } catch (error) {
    console.error('Error in updatePersonaService:', error);
    return {
      success: false,
      error: 'Failed to update persona',
    };
  }
};

const deactivatePersonaService = async (
  userId: number,
  personaId: number,
  prisma?: PrismaClient
): Promise<PersonaServiceResult<boolean>> => {
  try {
    // Check if persona exists and belongs to user
    const existingPersona = await findPersonaByUserAndId(userId, personaId, prisma);

    if (!existingPersona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    await softDeletePersona(personaId, prisma);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to deactivate persona',
    };
  }
};

export {
    createPersonaService,
    deactivatePersonaService,
    getPersonaByIdService,
    getUserPersonasService,
    updatePersonaService
};

