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
import { usePersonas } from '@/hooks/usePersonas';
import { personasApi } from '@/services/api/personas';
import { CreatePersonaRequest } from '@/types/chat';
import { createPersonaSchema } from '@/validations/persona';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiImageAddLine } from '@remixicon/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAddPersona({ isOpen, onClose }: Props) {
  const { createPersona } = usePersonas();
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePersonaRequest>({
    resolver: zodResolver(createPersonaSchema),
  });

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Generate pre-signed URL
      const { presignedUrl, key } = await personasApi.getPresignedUrl(file.type);

      // Upload file to S3
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Set the logo URL in the form
      const logoUrl = `${key}`;
      setValue('logo', logoUrl);

      // Show preview
      setLogoPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading logo:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setValue('tags', tagsArray);
  };

  const onSubmit = async (data: CreatePersonaRequest) => {
    try {
      // Convert tags string to array if it's a string
      const formData = {
        ...data,
        tags:
          typeof data.tags === 'string'
            ? data.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0)
            : data.tags || [],
      };
      await createPersona(formData);
      onClose();
    } catch (error) {
      console.error('Error creating persona:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Persona</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">
              Create a new AI assistant persona with custom instructions and behavior.
            </DialogDescription>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo" className="mb-2 block font-medium">
                    Logo
                  </Label>
                  <button
                    type="button"
                    className={`hover:border-primary relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-all ${
                      isUploading ? 'opacity-50' : ''
                    }`}
                    onClick={handleLogoClick}
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
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <RiImageAddLine className="h-8 w-8" />
                        <span className="mt-2 text-sm">Upload Logo</span>
                      </div>
                    )}
                  </button>
                </div>

                <div>
                  <Label htmlFor="name" className="font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    hasError={!!errors.name}
                    aria-invalid={!!errors.name}
                    placeholder="Enter persona name"
                    className="mt-2"
                  />
                  {errors.name && (
                    <span className="mt-1 text-sm text-red-500">{errors.name.message}</span>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    {...register('description')}
                    hasError={!!errors.description}
                    aria-invalid={!!errors.description}
                    placeholder="Brief description of the persona"
                    className="mt-2"
                  />
                  {errors.description && (
                    <span className="mt-1 text-sm text-red-500">{errors.description.message}</span>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags" className="font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    className="mt-2"
                    onChange={handleTagsChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions" className="font-medium">
                  Instructions *
                </Label>
                <textarea
                  id="instructions"
                  {...register('instructions')}
                  placeholder="Detailed instructions for the AI assistant"
                  rows={12}
                  className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.instructions
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-primary focus:ring-primary border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50'
                  }`}
                />
                {errors.instructions && (
                  <span className="mt-1 text-sm text-red-500">{errors.instructions.message}</span>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-fit">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-fit"
              isLoading={isSubmitting || isUploading}
              disabled={isSubmitting || isUploading}
            >
              Create Persona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
