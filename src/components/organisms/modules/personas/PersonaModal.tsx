import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Modal } from '@/components/molecules/common/Modal';
import { useFileUpload } from '@/hooks/useFileUpload';
import { S3_PUBLIC_BASE_URL } from '@/services/external/aws/s3';
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
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadFile,
    isUploading,
    error: uploadError,
    clearError,
  } = useFileUpload({
    uploadPurpose: 'PersonaLogo',
    objectName: 'persona',
    objectId: persona?.id || 0, // Use 0 for new personas to prevent upload
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
        logo: persona.logo || '',
      });
      // Set logo preview with full S3 URL if logo exists
      setLogoPreview(persona.logo ? `${S3_PUBLIC_BASE_URL}/${persona.logo}` : null);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        instructions: '',
        logo: '',
      });
      setLogoPreview(null);
    }
    setFormErrors({});
    setServerError(null);
    setServerFieldErrors({});
    clearError();
  }, [persona, mode, isOpen, clearError]);

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
    setServerError(null);
    setServerFieldErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    if (formData.instructions && formData.instructions.length > 10000)
      newErrors.instructions = 'Instructions must be 10000 characters or less';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
      });
      onClose();
    } catch (error: any) {
      // Try to parse server-side validation error
      const responseData = error?.response?.data;
      if (responseData) {
        if (Array.isArray(responseData.details)) {
          const fieldErrs: Record<string, string> = {};
          responseData.details.forEach((d: any) => {
            if (d?.field && d?.message) fieldErrs[d.field] = d.message;
          });
          setServerFieldErrors(fieldErrs);
        }
        setServerError(responseData.message || responseData.error || 'Failed to save persona');
      } else {
        setServerError('Failed to save persona');
      }
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

  // Custom footer for our modal
  const customFooter = (
    <div className="flex flex-shrink-0 flex-col-reverse items-center justify-end gap-3 p-4 max-sm:flex-row max-sm:gap-2 max-sm:p-3 sm:flex-row">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        className="w-full max-sm:w-auto sm:w-auto"
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="w-full max-sm:w-auto sm:w-auto"
        onClick={handleSubmit}
        disabled={
          loading ||
          isUploading ||
          !formData.name.trim() ||
          !formData.description.trim() ||
          !formData.instructions.trim() ||
          formData.instructions.length > 10000
        }
        isLoading={loading}
      >
        {submitText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="max-w-2xl"
      footer={customFooter}
    >
      <div className="space-y-6 p-6">
        {/* Global/server error */}
        {(serverError || Object.keys(serverFieldErrors).length > 0) && (
          <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-400">
            <p className="font-medium">{serverError || 'There were validation errors'}</p>
            {Object.keys(serverFieldErrors).length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {Object.entries(serverFieldErrors).map(([field, msg]) => (
                  <li key={field}>{`${field}: ${msg}`}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Logo Section */}
        <div>
          <Label htmlFor="logo" className="mb-2 block text-sm font-medium">
            Logo
          </Label>
          <div className="relative">
            <div
              className={`hover:border-primary relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                isUploading ? 'opacity-50' : ''
              } ${uploadError ? 'border-red-300' : 'border-gray-300'}`}
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogoClick();
                }
              }}
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
                <div className="relative h-full w-full rounded-lg">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="rounded-lg object-cover"
                    sizes="80px"
                  />
                  {/* Remove Logo Button positioned on the logo */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveLogo();
                    }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                    aria-label="Remove logo"
                  >
                    <RiCloseLine className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <RiImageAddLine className="h-5 w-5" />
                  <span className="mt-1 text-xs">Upload</span>
                </div>
              )}
            </div>
          </div>

          {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
          {isUploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name" className="mb-2 text-sm font-medium">
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
          {(serverFieldErrors.name || formErrors.name) && (
            <p className="mt-1 text-xs text-red-500">{serverFieldErrors.name || formErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="mb-2 text-sm font-medium">
            Description *
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the persona"
            className="mt-2"
            required
          />
          {(serverFieldErrors.description || formErrors.description) && (
            <p className="mt-1 text-xs text-red-500">
              {serverFieldErrors.description || formErrors.description}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div>
          <Label htmlFor="instructions" className="mb-2 text-sm font-medium">
            Instructions *
          </Label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Detailed instructions for the AI assistant"
            required
            className="mt-2 h-32 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
          {(serverFieldErrors.instructions || formErrors.instructions) && (
            <p className="mt-1 text-xs text-red-500">
              {serverFieldErrors.instructions || formErrors.instructions}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
