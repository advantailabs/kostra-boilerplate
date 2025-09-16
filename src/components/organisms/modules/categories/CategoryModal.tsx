'use client';

import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Modal } from '@/components/molecules/common/Modal';
import { useCategories } from '@/hooks/useCategories';
import { CategoryResponseType } from '@/types/blog.type';
import React, { useEffect, useState } from 'react';

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
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { createCategory, updateCategory, isCreating, isUpdating } = useCategories({
    page: currentPage,
    limit: currentLimit,
    name: currentSearch,
  });
  const isLoading = mode === 'create' ? isCreating : isUpdating;

  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        slug: '',
      });
    }
  }, [mode, category]);

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
        <div>
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Enter category name..."
            className="mt-1"
          />
          {formErrors.name && <span className="text-sm text-red-500">{formErrors.name}</span>}
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={e => handleInputChange('slug', e.target.value)}
            placeholder="Enter category slug..."
            className="mt-1"
          />
          {formErrors.slug && <span className="text-sm text-red-500">{formErrors.slug}</span>}
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{serverError}</div>
        )}
      </form>
    </Modal>
  );
}
