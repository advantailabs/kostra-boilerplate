'use client';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { KnowledgeBaseCard } from '@/components/molecules/chat/KnowledgeBaseCard';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { ModalKnowledgeBase } from '@/components/organisms/modules/knowledge-bases/ModalKnowledgeBase';
import { useKnowledgeBaseMutations, useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBaseWithFiles,
  UpdateKnowledgeBaseRequest,
} from '@/types/chat';
import { RiAddLine } from '@remixicon/react';
import { useState } from 'react';

export default function KnowledgeBasesPage() {
  const { data: knowledgeBasesData, isLoading } = useKnowledgeBases();
  const { createKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase } =
    useKnowledgeBaseMutations();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingKnowledgeBase, setEditingKnowledgeBase] = useState<KnowledgeBaseWithFiles | null>(
    null
  );
  const [deletingKnowledgeBase, setDeletingKnowledgeBase] = useState<KnowledgeBaseWithFiles | null>(
    null
  );

  const knowledgeBases = knowledgeBasesData?.knowledgeBases || [];

  const handleSubmit = async (data: CreateKnowledgeBaseRequest | UpdateKnowledgeBaseRequest) => {
    try {
      if (editingKnowledgeBase) {
        await updateKnowledgeBase.mutateAsync({
          id: editingKnowledgeBase.id,
          data: data as UpdateKnowledgeBaseRequest,
        });
      } else {
        await createKnowledgeBase.mutateAsync(data as CreateKnowledgeBaseRequest);
      }
      setShowModal(false);
      setEditingKnowledgeBase(null);
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
    }
  };

  const handleDeleteKnowledgeBase = async () => {
    if (!deletingKnowledgeBase) return;

    try {
      await deleteKnowledgeBase.mutateAsync(deletingKnowledgeBase.id);
      setShowDeleteModal(false);
      setDeletingKnowledgeBase(null);
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
    }
  };

  const openEditModal = (knowledgeBase: KnowledgeBaseWithFiles) => {
    setEditingKnowledgeBase(knowledgeBase);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingKnowledgeBase(null);
    setShowModal(true);
  };

  const openDeleteModal = (knowledgeBase: KnowledgeBaseWithFiles) => {
    setDeletingKnowledgeBase(knowledgeBase);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKnowledgeBase(null);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading knowledge bases..." />;
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Knowledge Bases</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your knowledge bases and organize your files
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <RiAddLine className="mr-2 h-4 w-4" />
          Create Knowledge Base
        </Button>
      </div>

      {/* Content */}
      <div className="h-full">
        {knowledgeBases.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No knowledge bases yet</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Create your first knowledge base to organize your files
              </p>
              <Button onClick={openCreateModal} className="mt-3">
                <RiAddLine className="mr-2 h-4 w-4" />
                Create Knowledge Base
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {knowledgeBases.length} knowledge base{knowledgeBases.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {knowledgeBases.map(knowledgeBase => (
                <KnowledgeBaseCard
                  key={knowledgeBase.id}
                  knowledgeBase={knowledgeBase}
                  onEdit={() => openEditModal(knowledgeBase)}
                  onDelete={() => openDeleteModal(knowledgeBase)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ModalKnowledgeBase
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        knowledgeBase={editingKnowledgeBase}
        mode={editingKnowledgeBase ? 'edit' : 'create'}
      />

      <DeleteDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingKnowledgeBase(null);
        }}
        onConfirm={handleDeleteKnowledgeBase}
        title="Delete Knowledge Base"
        itemName={deletingKnowledgeBase?.title}
        confirmText="Delete Knowledge Base"
      />
    </div>
  );
}
