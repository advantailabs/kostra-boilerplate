import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Dialog, DialogContent, DialogHeader } from '@/components/molecules/common/Dialog';
import { Persona } from '@prisma/client';
import { RiAddLine, RiRobot2Line } from '@remixicon/react';
import { useState } from 'react';

interface PersonaSelectionModalProps {
  isOpen: boolean;
  personas: Persona[];
  onClose: () => void;
  onSelectPersona: (_personaId: number) => void;
  onCreatePersona?: () => void;
}

export function PersonaSelectionModal({
  isOpen,
  personas,
  onClose,
  onSelectPersona,
  onCreatePersona,
}: PersonaSelectionModalProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | undefined>();

  const handleSelect = () => {
    if (selectedPersonaId) {
      onSelectPersona(selectedPersonaId);
      onClose();
    }
  };

  const handleCreatePersona = () => {
    onCreatePersona?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select a Persona</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose a persona to start your conversation
          </p>
        </DialogHeader>

        <div className="px-4 pt-4">
          {personas.length === 0 ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <RiRobot2Line className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
                No Personas Available
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Create a persona to start chatting.
              </p>
              <Button onClick={handleCreatePersona}>
                <RiAddLine className="mr-2 h-4 w-4" />
                Create Persona
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="max-h-80 overflow-y-auto">
                    {personas.map((persona, index) => (
                      <div key={persona.id}>
                        <button
                          onClick={() => setSelectedPersonaId(persona.id)}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedPersonaId === persona.id
                              ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100'
                              : ''
                          } ${index === 0 ? 'rounded-t-lg' : ''} ${
                            index === personas.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={persona.logo}
                              alt={`${persona.name} avatar`}
                              fallback={persona.name}
                              size="sm"
                            />
                            <div className="flex flex-1 items-center justify-between">
                              <span className="font-medium">{persona.name}</span>
                              {selectedPersonaId === persona.id && (
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Separator between list items */}
                        {index < personas.length - 1 && (
                          <div className="border-t border-gray-200 dark:border-gray-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full width separator line between list and buttons */}
              <div className="-mx-4 border-t border-gray-200 dark:border-gray-700" />

              {/* Action Buttons */}
              <div className="flex items-center justify-between py-4">
                <Button variant="ghost" onClick={handleCreatePersona} className="text-sm">
                  <RiAddLine className="mr-2 h-4 w-4" />
                  Create New
                </Button>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSelect} disabled={!selectedPersonaId}>
                    Select
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
