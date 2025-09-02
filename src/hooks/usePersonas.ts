import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import { personasApi } from '@/services/api/personas';
import { getCredits } from '@/store/credits';
import { openCreditPurchase } from '@/store/ui/modals';
import { CreatePersonaRequest, PublicPersona, UpdatePersonaRequest } from '@/types/chat';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

// Utility function to extract file information from a persona
export const getPersonaFileInfo = (persona: PublicPersona) => {
  // Since knowledgeBase is removed, return empty file info
  const fileCount = 0;
  const fileTypes: string[] = [];

  return { fileCount, fileTypes };
};

export function usePersonas() {
  const {
    data: personas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['personas'],
    queryFn: personasApi.getPersonas,
  });

  const createPersonaMutation = useApiMutation({
    mutationFn: async (data: CreatePersonaRequest) => {
      const credits = getCredits();
      if (credits < CREDIT_THRESHOLDS.creationMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to create persona');
      }
      return personasApi.createPersona(data);
    },
    successMessage: 'Persona created successfully!',
    invalidateQueries: [['personas']],
  });

  const updatePersonaMutation = useApiMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePersonaRequest }) => {
      const credits = getCredits();
      if (credits < CREDIT_THRESHOLDS.creationMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to update persona');
      }
      return personasApi.updatePersona(id, data);
    },
    successMessage: 'Persona updated successfully!',
    invalidateQueries: [['personas']],
  });

  const deletePersonaMutation = useApiMutation({
    mutationFn: (id: number) => personasApi.deletePersona(id),
    successMessage: 'Persona deleted successfully!',
    invalidateQueries: [['personas']],
  });

  return {
    personas,
    isLoading,
    error,
    refetch,
    createPersona: createPersonaMutation.mutateAsync,
    updatePersona: updatePersonaMutation.mutateAsync,
    deletePersona: deletePersonaMutation.mutateAsync,
    isCreating: createPersonaMutation.isPending,
    isUpdating: updatePersonaMutation.isPending,
    isDeleting: deletePersonaMutation.isPending,
  };
}
