import { Persona } from '@prisma/client';

import {
  createPersona,
  findActiveByUserId,
  findById,
  findPersonaByUserAndId,
  softDeletePersona,
  updatePersona,
} from '@/services/repositories/persona';
import { CreatePersonaData, UpdatePersonaData } from '@/types/chat';

export interface PersonaServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const createPersonaService = async (
  userId: number,
  data: CreatePersonaData
): Promise<PersonaServiceResult<Persona>> => {
  try {
    const persona = await createPersona({
      userId,
      name: data.name.trim(),
      description: data.description.trim(),
      instructions: data.instructions.trim(),
      tags: data.tags?.map(tag => tag.trim()) || [],
    });

    return {
      success: true,
      data: persona,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create persona',
    };
  }
};

const getUserPersonasService = async (userId: number): Promise<PersonaServiceResult<Persona[]>> => {
  try {
    const personas = await findActiveByUserId(userId);
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

const getPersonaByIdService = async (personaId: number): Promise<PersonaServiceResult<Persona>> => {
  try {
    const persona = await findById(personaId);
    if (!persona) {
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
  data: UpdatePersonaData
): Promise<PersonaServiceResult<Persona>> => {
  try {
    // Check if persona exists and belongs to user
    const existingPersona = await findPersonaByUserAndId(userId, personaId);
    if (!existingPersona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    // Sanitize data
    const sanitizedData: UpdatePersonaData = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.instructions && { instructions: data.instructions.trim() }),
      ...(data.tags && { tags: data.tags.map(tag => tag.trim()) }),
    };

    const updatedPersona = await updatePersona(personaId, sanitizedData);

    return {
      success: true,
      data: updatedPersona,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update persona',
    };
  }
};

const deactivatePersonaService = async (
  userId: number,
  personaId: number
): Promise<PersonaServiceResult<void>> => {
  try {
    // Check if persona exists and belongs to user
    const existingPersona = await findPersonaByUserAndId(userId, personaId);
    if (!existingPersona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    await softDeletePersona(personaId);

    return {
      success: true,
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
  updatePersonaService,
};
