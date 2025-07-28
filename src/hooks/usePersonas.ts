import { personasApi } from '@/services/api/personas';
import { CreatePersonaRequest, PersonaWithKnowledgeBase, UpdatePersonaRequest } from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const {
    data: personas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['personas'],
    queryFn: personasApi.getPersonas,
  });

  const createPersonaMutation = useMutation({
    mutationFn: (data: CreatePersonaRequest) => personasApi.createPersona(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
  });

  const updatePersonaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePersonaRequest }) =>
      personasApi.updatePersona(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
  });

  const deletePersonaMutation = useMutation({
    mutationFn: (id: number) => personasApi.deletePersona(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
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
