import { ContactSubmissionFilters } from '@/types/contact';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  contactClient,
  type CreateContactSubmissionRequest,
  type UpdateContactSubmissionRequest,
} from '../services/api/contact';

export function useContacts(filters: ContactSubmissionFilters = {}) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: () =>
      contactClient.list(
        parseInt(filters.page || '1', 10),
        parseInt(filters.limit || '10', 10),
        filters
      ),
    staleTime: 30_000,
    placeholderData: previousData => previousData,
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactSubmissionRequest }) =>
      contactClient.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactClient.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useCreateContact() {
  return useMutation({
    mutationFn: (data: CreateContactSubmissionRequest) => contactClient.create(data),
  });
}
