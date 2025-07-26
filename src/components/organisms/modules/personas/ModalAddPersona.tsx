import { PersonaModal } from './PersonaModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
}

export function ModalAddPersona({ isOpen, onClose, onSubmit }: Props) {
  return (
    <PersonaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      persona={null}
      mode="create"
    />
  );
}