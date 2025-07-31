/* eslint-disable no-nested-ternary */

'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Textarea } from '@/components/atom/Textarea';
import { Modal } from '@/components/molecules/common/Modal';
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBaseWithFiles,
  UpdateKnowledgeBaseRequest,
} from '@/types/chat';

interface ModalKnowledgeBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: CreateKnowledgeBaseRequest | UpdateKnowledgeBaseRequest) => Promise<void>;
  knowledgeBase?: KnowledgeBaseWithFiles | null;
  mode: 'create' | 'edit';
}

export function ModalKnowledgeBase({
  isOpen,
  onClose,
  onSubmit,
  knowledgeBase,
  mode,
}: ModalKnowledgeBaseProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && knowledgeBase) {
      setTitle(knowledgeBase.title);
      setDescription(knowledgeBase.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [isEditMode, knowledgeBase, isOpen]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
      };

      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} knowledge base:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isEditMode ? 'Edit Knowledge Base' : 'Create Knowledge Base';
  const modalDescription = isEditMode
    ? 'Update knowledge base details'
    : 'Create a new knowledge base';
  const submitButtonText = isEditMode ? 'Update Knowledge Base' : 'Create Knowledge Base';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      description={modalDescription}
      primaryActionText={submitButtonText}
      onPrimaryAction={handleSubmit}
      isPrimaryActionDisabled={!title.trim() || !description.trim()}
      isPrimaryActionLoading={isSubmitting}
      maxWidth="max-w-md"
    >
      <form
        className="py-2"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter knowledge base title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter knowledge base description"
            required
            disabled={isSubmitting}
            rows={3}
          />
        </div>
      </form>
    </Modal>
  );
}
