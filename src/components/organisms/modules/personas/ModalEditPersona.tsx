import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { Persona } from '@prisma/client';
import React, { useEffect, useState } from 'react';

interface ModalEditPersonaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  persona: Persona;
}

export function ModalEditPersona({ isOpen, onClose, onSubmit, persona }: ModalEditPersonaProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (persona) {
      setFormData({
        name: persona.name,
        description: persona.description || '',
        instructions: persona.instructions,
        tags: persona.tags?.join(', ') || '',
      });
    }
  }, [persona]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await onSubmit({
        ...formData,
        tags,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update persona:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Persona</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">
              Update the AI assistant persona with new instructions and behavior.
            </DialogDescription>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter persona name"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the persona"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions" className="font-medium">
                  Instructions *
                </Label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Detailed instructions for the AI assistant"
                  required
                  rows={12}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                />
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                className="mt-2 w-full sm:mt-0 sm:w-fit"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-fit"
              disabled={loading || !formData.name || !formData.instructions}
              isLoading={loading}
            >
              Update Persona
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
