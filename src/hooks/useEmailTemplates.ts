import {
  CreateEmailTemplateRequest,
  emailTemplatesApi,
  UpdateEmailTemplateRequest,
} from '@/services/api/email-templates';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useEmailTemplates() {
  const queryClient = useQueryClient();

  // Get all email templates
  const {
    data: emailTemplates,
    isLoading: isEmailTemplatesLoading,
    error: emailTemplatesError,
  } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: emailTemplatesApi.getEmailTemplates,
  });

  // Create email template mutation
  const createEmailTemplate = useMutation({
    mutationFn: (data: CreateEmailTemplateRequest) => emailTemplatesApi.createEmailTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  // Update email template mutation
  const updateEmailTemplate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmailTemplateRequest }) =>
      emailTemplatesApi.updateEmailTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  // Delete email template mutation
  const deleteEmailTemplate = useMutation({
    mutationFn: (id: number) => emailTemplatesApi.deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  return {
    emailTemplates: emailTemplates || [],
    isEmailTemplatesLoading,
    emailTemplatesError,
    createEmailTemplate: createEmailTemplate.mutateAsync,
    updateEmailTemplate: updateEmailTemplate.mutateAsync,
    deleteEmailTemplate: deleteEmailTemplate.mutateAsync,
    isCreating: createEmailTemplate.isPending,
    isUpdating: updateEmailTemplate.isPending,
    isDeleting: deleteEmailTemplate.isPending,
  };
}
