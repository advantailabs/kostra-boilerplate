import { Persona } from '@prisma/client';
import { PersonaModal } from './PersonaModal';

interface ModalEditPersonaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  persona: Persona;
}

export function ModalEditPersona({ isOpen, onClose, onSubmit, persona }: ModalEditPersonaProps) {
  return (
    <PersonaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      persona={persona}
      mode="edit"
    />
  );
}
