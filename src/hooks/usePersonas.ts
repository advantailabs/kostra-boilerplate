import { personasApi } from '@/services/api/personas';
import { CreatePersonaRequest, UpdatePersonaRequest } from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
