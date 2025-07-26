import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { useFileUpload } from '@/hooks/useFileUpload';
import { S3_BASE_URL } from '@/lib/s3';
import { Persona } from '@prisma/client';
import { RiCloseLine, RiImageAddLine } from '@remixicon/react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  persona?: Persona | null;
  mode: 'create' | 'edit';
}

export function PersonaModal({ isOpen, onClose, onSubmit, persona, mode }: PersonaModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    tags: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadFile,
    isUploading,
    error: uploadError,
    clearError,
  } = useFileUpload({
    onSuccess: url => {
      setFormData(prev => ({ ...prev, logo: url }));
    },
  });

  useEffect(() => {
    if (mode === 'edit' && persona) {
      setFormData({
        name: persona.name,
        description: persona.description || '',
        instructions: persona.instructions,
        tags: persona.tags?.join(', ') || '',
        logo: persona.logo || '',
      });
      // Set logo preview with full S3 URL if logo exists
      setLogoPreview(persona.logo ? `${S3_BASE_URL}/${persona.logo}` : null);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        instructions: '',
        tags: '',
        logo: '',
      });
      setLogoPreview(null);
    }
    clearError();
  }, [persona, mode, isOpen]);

  const handleLogoClick = () => {
    clearError();
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setLogoPreview(URL.createObjectURL(file));
    }

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
    setLogoPreview(null);
    clearError();
  };

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
      console.error(`Failed to ${mode} persona:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Persona' : 'Create New Persona';
  const description = isEdit
    ? 'Update the AI assistant persona with new instructions and behavior.'
    : 'Create a new AI assistant persona with custom instructions and behavior.';
  const submitText = isEdit ? 'Update Persona' : 'Create Persona';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">{description}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Header Section with Logo and Basic Info */}
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <Label htmlFor="logo" className="mb-3 block font-medium">
                  Logo
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    className={`hover:border-primary relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                      isUploading ? 'opacity-50' : ''
                    } ${uploadError ? 'border-red-300' : 'border-gray-300'}`}
                    onClick={handleLogoClick}
                    disabled={isUploading}
                    aria-label="Upload logo"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                      disabled={isUploading}
                      id="logo"
                    />
                    {logoPreview ? (
                      <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <RiImageAddLine className="h-6 w-6" />
                        <span className="mt-1 text-xs">Upload</span>
                      </div>
                    )}
                  </button>

                  {/* Remove Logo Button */}
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                      aria-label="Remove logo"
                    >
                      <RiCloseLine className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
                {isUploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
              </div>

              {/* Basic Info Section */}
              <div className="flex-1 space-y-4">
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
            </div>

            {/* Instructions Section */}
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
                rows={10}
                className="mt-2 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading || isUploading || !formData.name || !formData.instructions}
              isLoading={loading}
            >
              {submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
