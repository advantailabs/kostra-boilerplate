/* eslint-disable no-nested-ternary */

'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Textarea } from '@/components/atom/Textarea';
import { Dialog, DialogContent, DialogHeader } from '@/components/molecules/common/Dialog';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  const submitButtonText = isSubmitting
    ? isEditMode
      ? 'Updating...'
      : 'Creating...'
    : isEditMode
      ? 'Update Knowledge Base'
      : 'Create Knowledge Base';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{modalTitle}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isEditMode ? 'Update knowledge base details' : 'Create a new knowledge base'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 pt-4">
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

          <div className="-mx-4 border-t border-gray-200 dark:border-gray-700" />

          <div className="flex justify-end gap-3 py-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
              {submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
