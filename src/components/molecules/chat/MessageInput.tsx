import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Persona } from '@prisma/client';
import { RiArrowDownSLine, RiSendPlaneFill, RiUserLine } from '@remixicon/react';
import React, { useState } from 'react';

interface MessageInputProps {
  personas: Persona[];
  selectedPersonaId?: number;
  onPersonaSelect: (_personaId: number) => void;
  onSendMessage: (_message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  hidePersonaSelector?: boolean;
  className?: string;
}

export function MessageInput({
  personas,
  selectedPersonaId,
  onPersonaSelect,
  onSendMessage,
  disabled = false,
  loading = false,
  placeholder = 'Type your message...',
  hidePersonaSelector = false,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);

  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  const handleSend = () => {
    if (message.trim() && !disabled && !loading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePersonaSelect = (personaId: number) => {
    onPersonaSelect(personaId);
    setIsPersonaDropdownOpen(false);
  };

  const canSend = message.trim() && selectedPersonaId && !disabled && !loading;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Persona Selector - only show if not hidden */}
      {!hidePersonaSelector && (
        <div className="relative">
          <Label htmlFor="persona-select">Persona</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                !disabled && !loading && setIsPersonaDropdownOpen(!isPersonaDropdownOpen)
              }
              disabled={disabled || loading}
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center gap-2">
                <RiUserLine className="h-4 w-4 text-gray-400" />
                <span
                  className={
                    selectedPersona
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {selectedPersona ? selectedPersona.name : 'Select a persona to start chatting...'}
                </span>
              </div>
              <RiArrowDownSLine
                className={`h-4 w-4 text-gray-400 transition-transform ${isPersonaDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isPersonaDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                {personas.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No personas available
                  </div>
                ) : (
                  <ul className="py-1">
                    {personas.map(persona => (
                      <li key={persona.id}>
                        <button
                          type="button"
                          onClick={() => handlePersonaSelect(persona.id)}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedPersonaId === persona.id
                              ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100'
                              : ''
                          }`}
                        >
                          <RiUserLine className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{persona.name}</div>
                            {persona.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {persona.description}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || loading}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!canSend} isLoading={loading} className="px-3">
          <RiSendPlaneFill className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
