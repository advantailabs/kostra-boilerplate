'use client';

import { Modal } from '@/components/molecules/common/Modal';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import { CategoryResponseType } from '@/types/blog.type';
import React, { useState } from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { name: string; slug: string }) => void;
  category?: CategoryResponseType | null;
  mode: 'create' | 'edit';
  currentPage?: number;
  currentLimit?: number;
  currentSearch?: string;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  mode,
  currentPage = 1,
  currentLimit = 10,
  currentSearch,
}: CategoryModalProps) {
  const [formData, setFormData] = useState(() => {
    if (mode === 'edit' && category) {
      return {
        name: category.name || '',
        slug: category.slug || '',
      }
    }
    return {
      name: '',
      slug: '',
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { createCategory, updateCategory, isCreating, isUpdating } = useCategories({
    page: currentPage,
    limit: currentLimit,
    name: currentSearch,
  });
  const isLoading = mode === 'create' ? isCreating : isUpdating;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
    });
    setFormErrors({});
    setServerError(null);
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Prevent double submission
    if (isLoading) {
      return;
    }

    setFormErrors({});
    setServerError(null);

    // Basic validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (mode === 'create') {
        createCategory(formData, {
          onSuccess: () => {
            handleClose();
            onSubmit(formData);
          },
          onError: () => {
            setServerError('Failed to create category. Please try again.');
          },
        });
      } else if (mode === 'edit' && category) {
        updateCategory(
          { id: category.id, data: formData },
          {
            onSuccess: () => {
              handleClose();
              onSubmit(formData);
            },
            onError: () => {
              setServerError('Failed to update category. Please try again.');
            },
          }
        );
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setServerError('Failed to save category. Please try again.');
    }
  };

  // Check if form is valid for create mode
  const isFormValid = formData.name.trim() && formData.slug.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-md"
      title={mode === 'create' ? 'Create Category' : 'Edit Category'}
      primaryActionText={mode === 'create' ? 'Create Category' : 'Update Category'}
      secondaryActionText="Cancel"
      onPrimaryAction={handleSubmit}
      isPrimaryActionDisabled={!isFormValid}
      isPrimaryActionLoading={isLoading}
    >
      <form className="space-y-4">
        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">
            Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Enter category name..."
            className="mt-1"
          />
          <FieldError errors={formErrors.name ? [{ message: formErrors.name }] : []} />
        </Field>

        {/* Slug */}
        <Field>
          <FieldLabel htmlFor="slug">
            Slug <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="slug"
            value={formData.slug}
            onChange={e => handleInputChange('slug', e.target.value)}
            placeholder="Enter category slug..."
            className="mt-1"
          />
          <FieldError errors={formErrors.slug ? [{ message: formErrors.slug }] : []} />
        </Field>

        {serverError && (
          <div className="bg-danger/10 rounded-md p-3 text-sm text-destructive">{serverError}</div>
        )}
      </form>
    </Modal>
  );
}
