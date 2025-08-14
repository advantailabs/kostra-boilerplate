import { personasApi } from '@/services/api/personas';
import { CreatePersonaRequest, PersonaWithKnowledgeBase, UpdatePersonaRequest } from '@/types/chat';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from './useApiMutation';

// Utility function to extract file information from a persona
export const getPersonaFileInfo = (persona: PersonaWithKnowledgeBase) => {
  const files = persona.knowledgeBase?.fileKnowledgeBases || [];
  const fileCount = files.length;

  // Extract unique file types from MIME types
  const fileTypes = Array.from(
    new Set(
      files.map(file => {
        const mimeType = file.file.mimeType.toLowerCase();
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
        if (mimeType.includes('image')) return 'Image';
        return 'Document'; // Default fallback
      })
    )
  );

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
    mutationFn: (data: CreatePersonaRequest) => personasApi.createPersona(data),
    successMessage: 'Persona created successfully!',
    invalidateQueries: [['personas']],
  });

  const updatePersonaMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePersonaRequest }) =>
      personasApi.updatePersona(id, data),
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
