import { handleApiError, handleApiSuccess } from '@/lib/utils/error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
  invalidateQueries?: string[][];
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
}

/**
 * Custom hook for API mutations with automatic error handling and toast notifications
 * Integrates with the global axios interceptor for consistent error handling
 */
export function useApiMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = [],
  successMessage,
  errorMessage,
  showSuccessToast = true,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Handle success toast
      if (showSuccessToast && successMessage) {
        handleApiSuccess({ message: successMessage });
      }

      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      // Call custom onSuccess handler
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      // Handle error with toast
      handleApiError(error, errorMessage);

      // Call custom onError handler
      if (onError) {
        onError(error, variables);
      }
    },
  });
}

/**
 * Example usage:
 *
 * const createPersonaMutation = useApiMutation({
 *   mutationFn: personasApi.createPersona,
 *   successMessage: 'Persona created successfully!',
 *   errorMessage: 'Failed to create persona',
 *   invalidateQueries: [['personas']],
 * });
 *
 * // Use it
 * const handleCreate = async (data: CreatePersonaRequest) => {
 *   try {
 *     await createPersonaMutation.mutateAsync(data);
 *     // Success is automatically handled
 *   } catch (error) {
 *     // Error is automatically handled
 *   }
 * };
 */
