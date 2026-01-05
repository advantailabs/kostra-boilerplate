'use client';

import { useCallback, useState } from 'react';

import { EmailTemplate } from '@/services/api/email-templates';
import { useEmailTemplates } from '../../../../hooks/useEmailTemplates';
import { DeleteEmailTemplateDialog } from './DeleteEmailTemplateDialog';
import { EmailTemplateEditorModal } from './EmailTemplateEditorModal';
import { EmailTemplatesTable } from './EmailTemplatesTable';

interface EmailTemplatesPageProps {
  className?: string;
}

export function EmailTemplatesPage({ className }: EmailTemplatesPageProps) {
  // Fetch email templates from the database
  const { emailTemplates, isEmailTemplatesLoading } = useEmailTemplates();

  const [isEmailTemplateModalOpen, setIsEmailTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete template dialog
  const [isDeleteTemplateDialogOpen, setIsDeleteTemplateDialogOpen] = useState(false);
  // State to store the ID of the template being deleted
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);
  // State to store the name of the template being deleted
  const [deletingTemplateName, setDeletingTemplateName] = useState<string>('');

  // State to track current page for delete context
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditTemplate = useCallback((template: EmailTemplate) => {
    setEditingTemplate(template);
    setModalMode('edit');
    setIsEmailTemplateModalOpen(true);
  }, []);

  const handleAddTemplate = useCallback(() => {
    setEditingTemplate(null);
    setModalMode('create');
    setIsEmailTemplateModalOpen(true);
  }, []);

  const handleTemplateModalClose = useCallback(() => {
    setIsEmailTemplateModalOpen(false);
    setTimeout(() => {
      setEditingTemplate(null);
    }, 300);
  }, []);

  const handleTemplateSuccess = useCallback(() => {
    // Close the modal and reset the editing state
    setIsEmailTemplateModalOpen(false);
    setTimeout(() => {
      setEditingTemplate(null);
    }, 300);
  }, []);

  /**
   * Handles deleting a template
   * @param templateId The ID of the template to delete
   * @param templateName The name of the template to delete
   */
  const handleDeleteTemplate = useCallback((templateId: number, templateName: string) => {
    setDeletingTemplateId(templateId);
    setDeletingTemplateName(templateName);
    setIsDeleteTemplateDialogOpen(true);
  }, []);

  /**
   * Handles closing the delete template dialog
   */
  const handleDeleteTemplateDialogClose = useCallback(() => {
    setIsDeleteTemplateDialogOpen(false);
    setTimeout(() => {
      setDeletingTemplateId(null);
      setDeletingTemplateName('');
    }, 300);
  }, []);

  /**
   * Callback when a template is successfully deleted
   */
  const handleDeleteTemplateSuccess = useCallback(() => {
    // Modal is already closed by the ActionDialog, just reset the delete state
    setTimeout(() => {
      setDeletingTemplateId(null);
      setDeletingTemplateName('');
    }, 300);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className={className}>
      <EmailTemplateEditorModal
        key={`editor-${modalMode}-${editingTemplate?.id || 'new'}`}
        isOpen={isEmailTemplateModalOpen}
        onClose={handleTemplateModalClose}
        onSuccess={handleTemplateSuccess}
        template={editingTemplate}
        mode={modalMode}
      />

      <DeleteEmailTemplateDialog
        key={`delete-${deletingTemplateId || 'none'}`}
        isOpen={isDeleteTemplateDialogOpen}
        onClose={handleDeleteTemplateDialogClose}
        templateId={deletingTemplateId}
        templateName={deletingTemplateName}
        onSuccess={handleDeleteTemplateSuccess}
        currentPage={currentPage}
      />

      <EmailTemplatesTable
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
        onAdd={handleAddTemplate}
        onPageChange={handlePageChange}
        templates={emailTemplates || []}
        isLoading={isEmailTemplatesLoading}
      />
    </div>
  );
}
