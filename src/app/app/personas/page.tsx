'use client';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PersonaCard } from '@/components/molecules/chat/PersonaCard';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import { DeletePersonaDialog } from '@/components/organisms/modules/personas/DeletePersonaDialog';
import { ModalAddPersona } from '@/components/organisms/modules/personas/ModalAddPersona';
import { ModalEditPersona } from '@/components/organisms/modules/personas/ModalEditPersona';
import { usePersonas } from '@/hooks/usePersonas';
import { CreatePersonaRequest, PublicPersona, UpdatePersonaRequest } from '@/types/chat';
import { RiAddLine } from '@remixicon/react';
import { useState } from 'react';

export default function PersonasPage() {
  const { personas, isLoading, createPersona, updatePersona, deletePersona, isDeleting } =
    usePersonas();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<PublicPersona | null>(null);
  const [deletingPersona, setDeletingPersona] = useState<PublicPersona | null>(null);

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

  const openEditModal = (persona: PublicPersona) => {
    setEditingPersona(persona);
    setShowEditModal(true);
  };

  const openDeleteModal = (persona: PublicPersona) => {
    setDeletingPersona(persona);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading personas..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3 dark:border-gray-700">
        <PageHeader
          title="Personas"
          description="Manage your AI assistant personas and their instructions"
        />
        <div className="px-4 py-3 max-sm:hidden">
          <Button
            onClick={() => setShowAddModal(true)}
            className="max-sm:w-auto max-sm:justify-center max-sm:px-2 max-sm:py-2"
          >
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Persona
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-full p-4 max-sm:p-3">
        {/* Mobile Create Button - Only visible on mobile */}
        <div className="hidden max-sm:mb-4 max-sm:block">
          <Button
            onClick={() => setShowAddModal(true)}
            className="max-sm:w-auto max-sm:justify-center max-sm:px-4 max-sm:py-1.5"
          >
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Persona
          </Button>
        </div>
        {personas.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 max-sm:h-auto max-sm:min-h-[200px] max-sm:px-4 max-sm:py-8 dark:border-gray-600">
            <div className="text-center max-sm:px-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">No personas yet</p>
              <p className="mt-1 text-xs text-gray-400 max-sm:text-center dark:text-gray-500">
                Create your first persona to start chatting
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="mt-3 max-sm:mt-2 max-sm:w-full max-sm:justify-center max-sm:px-4 max-sm:py-1.5"
              >
                <RiAddLine className="mr-2 h-4 w-4" />
                Create Persona
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 max-sm:mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {personas.length} persona{personas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid gap-4 max-sm:grid-cols-1 max-sm:gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

      <DeletePersonaDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPersona(null);
        }}
        personaId={deletingPersona?.id || null}
        personaName={deletingPersona?.name || ''}
        deletePersona={deletePersona}
        isDeleting={isDeleting}
      />
    </div>
  );
}
