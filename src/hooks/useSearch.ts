'use client';

import { handleApiError } from '@/lib/utils/error-handler';
import { useMutation } from '@tanstack/react-query';

import {
  smartSearch,
  type SmartSearchRequest,
  type SmartSearchResponse,
} from '@/services/api/search';

export function useSmartSearch() {
  const mutation = useMutation<SmartSearchResponse, Error, SmartSearchRequest>({
    mutationKey: ['smart-search'],
    mutationFn: smartSearch,
    onError: (error: unknown) => handleApiError(error, 'Search failed'),
  });

  return {
    search: mutation.mutateAsync,
    isPending: mutation.isPending,
  } as const;
}
