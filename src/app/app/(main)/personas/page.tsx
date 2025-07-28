'use client';

import { Button } from '@/components/atom/Button';
import { PersonaCard } from '@/components/molecules/chat/PersonaCard';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { ModalAddPersona } from '@/components/organisms/modules/personas/ModalAddPersona';
import { ModalEditPersona } from '@/components/organisms/modules/personas/ModalEditPersona';
import { usePersonas } from '@/hooks/usePersonas';
import { CreatePersonaRequest, UpdatePersonaRequest } from '@/types/chat';
import { Persona } from '@prisma/client';
import { RiAddLine } from '@remixicon/react';
import { useState } from 'react';

export default function PersonasPage() {
  const { personas, isLoading, createPersona, updatePersona, deletePersona } = usePersonas();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [deletingPersona, setDeletingPersona] = useState<Persona | null>(null);

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

  const openEditModal = (persona: Persona) => {
    setEditingPersona(persona);
    setShowEditModal(true);
  };

  const openDeleteModal = (persona: Persona) => {
    setDeletingPersona(persona);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personas</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your AI assistant personas and their instructions
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <RiAddLine className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
      </div>

      {/* Content */}
      <div className="h-full">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {personas.map(persona => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onEdit={() => openEditModal(persona)}
                onDelete={() => openDeleteModal(persona)}
                fileCount={Math.floor(Math.random() * 5) + 1}
                fileTypes={['PDF', 'Excel', 'Document', 'Image'].slice(
                  0,
                  Math.floor(Math.random() * 4) + 1
                )}
              />
            ))}
          </div>
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
