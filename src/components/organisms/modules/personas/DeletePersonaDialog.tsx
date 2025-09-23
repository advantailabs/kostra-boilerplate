import { DeleteDialog } from '../../../molecules/common/DeleteDialog';

interface DeletePersonaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personaId: number | null;
  personaName: string;
  onSuccess?: () => void;
  deletePersona: (id: number) => Promise<void>;
  isDeleting: boolean;
}

export function DeletePersonaDialog({
  isOpen,
  onClose,
  personaId,
  personaName,
  onSuccess,
  deletePersona,
  isDeleting,
}: DeletePersonaDialogProps) {
  const handleDelete = async () => {
    if (!personaId) return;
    await deletePersona(personaId);
  };

  return (
    <DeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Persona"
      itemName={personaName}
      itemType="persona"
      isLoading={isDeleting}
      onSuccess={onSuccess}
    />
  );
}
