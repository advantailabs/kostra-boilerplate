'use client';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PersonaCard } from '@/components/molecules/chat/PersonaCard';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import { ModalAddPersona } from '@/components/organisms/modules/personas/ModalAddPersona';
import { ModalEditPersona } from '@/components/organisms/modules/personas/ModalEditPersona';
import { usePersonas } from '@/hooks/usePersonas';
import { CreatePersonaRequest, PersonaWithKnowledgeBase, UpdatePersonaRequest } from '@/types/chat';
import { RiAddLine } from '@remixicon/react';
import { useState } from 'react';

export default function PersonasPage() {
  const { personas, isLoading, createPersona, updatePersona, deletePersona } = usePersonas();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<PersonaWithKnowledgeBase | null>(null);
  const [deletingPersona, setDeletingPersona] = useState<PersonaWithKnowledgeBase | null>(null);

  const handleAddPersona = async (personaData: CreatePersonaRequest) => {
    try {
      await createPersona(personaData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create persona:', error);
    }
  };

  const handleEditPersona = async (personaData: UpdatePersonaRequest) => {
    if (!editingPersona) return;

    try {
      await updatePersona({ id: editingPersona.id, data: personaData });
      setShowEditModal(false);
      setEditingPersona(null);
    } catch (error) {
      console.error('Failed to update persona:', error);
    }
  };

  const handleDeletePersona = async () => {
    if (!deletingPersona) return;

    try {
      await deletePersona(deletingPersona.id);
      setShowDeleteModal(false);
      setDeletingPersona(null);
    } catch (error) {
      console.error('Failed to delete persona:', error);
    }
  };

  const openEditModal = (persona: PersonaWithKnowledgeBase) => {
    setEditingPersona(persona);
    setShowEditModal(true);
  };

  const openDeleteModal = (persona: PersonaWithKnowledgeBase) => {
    setDeletingPersona(persona);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading personas..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <PageHeader
          title="Personas"
          description="Manage your AI assistant personas and their instructions"
        />
        <div className="px-4 py-3">
          <Button onClick={() => setShowAddModal(true)}>
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Persona
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-full p-4">
        {personas.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No personas yet</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Create your first persona to start chatting
              </p>
              <Button onClick={() => setShowAddModal(true)} className="mt-3">
                <RiAddLine className="mr-2 h-4 w-4" />
                Create Persona
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {personas.length} persona{personas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {personas.map(persona => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  onEdit={() => openEditModal(persona)}
                  onDelete={() => openDeleteModal(persona)}
                  onClick={() => openEditModal(persona)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <ModalAddPersona
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPersona}
        />
      )}

      {showEditModal && editingPersona && (
        <ModalEditPersona
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingPersona(null);
          }}
          onSubmit={handleEditPersona}
          persona={editingPersona}
        />
      )}

      <DeleteDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPersona(null);
        }}
        onConfirm={handleDeletePersona}
        title="Delete Persona"
        itemName={deletingPersona?.name}
        confirmText="Delete Persona"
      />
    </div>
  );
}
