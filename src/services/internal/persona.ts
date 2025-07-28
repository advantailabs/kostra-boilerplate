import { Persona, PrismaClient } from '@prisma/client';

import {
  createAssistant,
  createVectorStore,
  updateAssistant,
} from '@/services/external/openai/assistant';
import { createKnowledgeBase } from '@/services/repositories/knowledge-base';
import {
  createPersona,
  findActiveByUserId,
  findById,
  findPersonaByUserAndId,
  softDeletePersona,
  updatePersona,
} from '@/services/repositories/persona';
import { CreateKnowledgeBaseData, CreatePersonaData, UpdatePersonaData } from '@/types/chat';

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
    // Create vector store first
    const vectorStoreResult = await createVectorStore(`${data.name.trim()} Knowledge Base`);

    if (!vectorStoreResult.success || !vectorStoreResult.data) {
      return {
        success: false,
        error: `Failed to create vector store: ${vectorStoreResult.error}`,
      };
    }

    // Create knowledge base
    const knowledgeBaseData: CreateKnowledgeBaseData = {
      userId,
      title: `${data.name.trim()} Knowledge Base`,
      description: `Knowledge base for ${data.name.trim()} persona`,
      metadata: {
        personaName: data.name.trim(),
        personaDescription: data.description.trim(),
      },
      vectorStoreId: vectorStoreResult.data.id,
    };

    const knowledgeBaseResult = await createKnowledgeBase(knowledgeBaseData);

    if (!knowledgeBaseResult.success || !knowledgeBaseResult.data) {
      return {
        success: false,
        error: `Failed to create knowledge base: ${knowledgeBaseResult.error}`,
      };
    }

    // Create OpenAI assistant with file_search tool and vector store
    const assistantResult = await createAssistant({
      name: data.name.trim(),
      description: data.description.trim(),
      instructions: data.instructions.trim(),
      temperature: 0.3,
      tools: [{ type: 'code_interpreter' }, { type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreResult.data.id],
        },
      },
    });

    if (!assistantResult.success || !assistantResult.data) {
      return {
        success: false,
        error: `Failed to create OpenAI assistant: ${assistantResult.error}`,
      };
    }

    // Create persona with assistant ID and knowledge base ID
    const persona = await createPersona(
      {
        userId,
        name: data.name.trim(),
        description: data.description.trim(),
        instructions: data.instructions.trim(),
        tags: data.tags?.map(tag => tag.trim()) || [],
        logo: data.logo,
        openaiAssistantId: assistantResult.data.id,
        knowledgeBaseId: knowledgeBaseResult.data.id,
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
): Promise<PersonaServiceResult<Persona[]>> => {
  try {
    const personas = await findActiveByUserId(userId, prisma);
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
): Promise<PersonaServiceResult<Persona>> => {
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
): Promise<PersonaServiceResult<Persona>> => {
  try {
    // Check if persona exists and belongs to user
    const existingPersona = await findPersonaByUserAndId(userId, personaId, prisma);

    if (!existingPersona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    // Update OpenAI assistant if it exists
    if (existingPersona.openaiAssistantId) {
      const assistantUpdateData: any = {};
      if (data.name !== undefined) assistantUpdateData.name = data.name.trim();
      if (data.description !== undefined) assistantUpdateData.description = data.description.trim();
      if (data.instructions !== undefined)
        assistantUpdateData.instructions = data.instructions.trim();

      if (Object.keys(assistantUpdateData).length > 0) {
        const assistantResult = await updateAssistant({
          assistantId: existingPersona.openaiAssistantId,
          ...assistantUpdateData,
        });

        if (!assistantResult.success) {
          console.error('Failed to update OpenAI assistant:', assistantResult.error);
          // Continue with persona update even if assistant update fails
        }
      }
    }

    const updatedPersona = await updatePersona(
      personaId,
      {
        name: data.name?.trim(),
        description: data.description?.trim(),
        instructions: data.instructions?.trim(),
        tags: data.tags?.map(tag => tag.trim()),
        logo: data.logo,
        knowledgeBaseId: data.knowledgeBaseId,
      },
      prisma
    );

    return {
      success: true,
      data: updatedPersona,
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
  updatePersonaService,
};
