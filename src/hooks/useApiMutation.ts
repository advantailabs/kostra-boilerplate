import { handleApiError, handleApiSuccess } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (_: TVariables) => Promise<TData>;
  onSuccess?: (_data: TData, _variables: TVariables) => void;
  onError?: (_error: unknown, _variables: TVariables) => void;
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
    onSuccess: (data, _variables) => {
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
        onSuccess(data, _variables);
      }
    },
    onError: (error, _variables) => {
      // Avoid duplicate toasts: axios interceptor already shows a toast for Axios errors
      if (!(error instanceof AxiosError)) {
        handleApiError(error, errorMessage);
      }

      // Call custom onError handler
      if (onError) {
        onError(error, _variables);
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
