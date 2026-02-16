'use client';

import { Modal } from '@/components/molecules/common/Modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usePackages } from '@/hooks/usePackages';
import { X } from 'lucide-react';
import React, { useState } from 'react';

interface Package {
  id: number;
  title: string;
  description: string;
  isFeatured: boolean;
  price: number | string; // Can be number from API or Decimal string from DB
  currencySymbol: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: unknown) => void;
  package?: Package | null;
  mode: 'create' | 'edit';
  currentPage?: number;
  currentLimit?: number;
  currentSearch?: string;
}

export function PackageModal({
  isOpen,
  onClose,
  onSubmit,
  package: pkg,
  mode,
  currentPage = 1,
  currentLimit = 10,
  currentSearch,
}: PackageModalProps) {

  const initializeFormData = () => {
    if (mode === 'edit' && pkg) {
      // Convert Decimal string to number if needed
      const priceValue = typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price;
      return {
        title: pkg.title || '',
        description: pkg.description || '',
        isFeatured: pkg.isFeatured || false,
        price: priceValue || 0,
        currencySymbol: pkg.currencySymbol || '$',
        features: pkg.features || [],
      }
    }
    return {
      title: '',
      description: '',
      isFeatured: false,
      price: 0,
      currencySymbol: '$',
      features: [],
    }
  }

  const [formData, setFormData] = useState(initializeFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [priceDisplay, setPriceDisplay] = useState(() => pkg ? pkg.price.toString() : '');

  const { createPackage, updatePackage, isCreating, isUpdating } = usePackages({
    page: currentPage,
    limit: currentLimit,
    title: currentSearch,
  });
  const isLoading = mode === 'create' ? isCreating : isUpdating;

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCurrencySymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow valid currency symbol characters (no numbers, no spaces)
    if (value === '' || /^[^\d\s]{1,4}$/.test(value)) {
      setFormData(prev => ({ ...prev, currencySymbol: value }));
      if (formErrors.currencySymbol) {
        setFormErrors(prev => ({ ...prev, currencySymbol: '' }));
      }
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceDisplay(value);

    // Handle empty string
    if (value === '') {
      setFormData(prev => ({ ...prev, price: 0 }));
      return;
    }

    // Handle special cases for better UX - keep display as-is
    if (value === '0' || value === '0.' || value === '.') {
      return;
    }

    // Parse the number, removing leading zeros
    const numericValue = parseFloat(value);

    // If it's a valid number, update the form data
    if (!Number.isNaN(numericValue) && numericValue >= 0) {
      setFormData(prev => ({ ...prev, price: numericValue }));
    }

    // Clear any price-related errors
    if (formErrors.price) {
      setFormErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clean up incomplete decimal inputs on blur
    if (value === '0.' || value === '.' || value === '') {
      setFormData(prev => ({ ...prev, price: 0 }));
      setPriceDisplay('');
    } else {
      // Update display to match the numeric value
      const numericValue = parseFloat(value);
      if (!Number.isNaN(numericValue)) {
        setPriceDisplay(numericValue.toString());
      }
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      isFeatured: false,
      price: 0,
      currencySymbol: '$',
      features: [],
    });
    setFormErrors({});
    setServerError(null);
    setFeatureInput('');
    setPriceDisplay('');
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
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.price < 0) errors.price = 'Price must be a positive number';

    // Currency symbol validation
    if (!formData.currencySymbol.trim()) {
      errors.currencySymbol = 'Currency symbol is required';
    } else if (!/^[^\d\s]{1,4}$/.test(formData.currencySymbol.trim())) {
      errors.currencySymbol = 'Currency symbol must be 1-4 characters, no numbers or spaces';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (mode === 'create') {
        createPackage(formData, {
          onSuccess: () => {
            handleClose();
            onSubmit(formData);
          },
          onError: () => {
            setServerError('Failed to create package. Please try again.');
          },
        });
      } else if (mode === 'edit' && pkg) {
        updatePackage(
          { id: pkg.id, data: formData },
          {
            onSuccess: () => {
              handleClose();
              onSubmit(formData);
            },
            onError: () => {
              setServerError('Failed to update package. Please try again.');
            },
          }
        );
      }
    } catch (error) {
      console.error('Error saving package:', error);
      setServerError('Failed to save package. Please try again.');
    }
  };

  // Check if form is valid
  const isFormValid = formData.title.trim() && formData.description.trim() && formData.price >= 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-2xl!"
      title={mode === 'create' ? 'Create Package' : 'Edit Package'}
      primaryActionText={mode === 'create' ? 'Create Package' : 'Update Package'}
      secondaryActionText="Cancel"
      onPrimaryAction={handleSubmit}
      isPrimaryActionDisabled={!isFormValid}
      isPrimaryActionLoading={isLoading}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Title */}
          <Field className='sm:col-span-2'>
            <FieldLabel htmlFor="title">Title <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Enter package title..."
              className="mt-1"
            />
            <FieldError errors={formErrors.title ? [{ message: formErrors.title }] : []} />
          </Field>

          {/* Description */}

          <Field className='sm:col-span-2'>
            <FieldLabel htmlFor="description">Description <span className="text-destructive">*</span></FieldLabel>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Enter package description..."
              rows={3}
            />
            <FieldError errors={formErrors.description ? [{ message: formErrors.description }] : []} />
          </Field>

          {/* Price */}
          <Field className=''>
            <FieldLabel htmlFor="price">Price <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={priceDisplay}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              placeholder="0.00"
              className="mt-1"
            />
            <FieldError errors={formErrors.price ? [{ message: formErrors.price }] : []} />
          </Field>

          {/* Currency Symbol */}
          <Field className=''>
            <FieldLabel htmlFor="currencySymbol">Currency Symbol <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="currencySymbol"
              value={formData.currencySymbol}
              onChange={handleCurrencySymbolChange}
              placeholder="$"
              className="mt-1"
              maxLength={4}
            />
            <FieldDescription>Examples: $, €, £, ¥, ₹</FieldDescription>
            <FieldError errors={formErrors.currencySymbol ? [{ message: formErrors.currencySymbol }] : []} />
          </Field>

          {/* Featured */}
          <FieldLabel htmlFor="isFeatured" className='sm:col-span-2 px-0! border-none!'>
            <Field orientation="horizontal" className='px-0! '>
              <FieldContent className='cursor-pointer!'>
                <FieldTitle>Featured Package</FieldTitle>
                <FieldDescription>
                  Mark this package as featured
                </FieldDescription>
              </FieldContent>
              <Switch id="isFeatured" checked={formData.isFeatured} onCheckedChange={checked => handleInputChange('isFeatured', checked)} />
            </Field>
          </FieldLabel>
        </div>

        {/* Features */}
        <div>
          <Label>Features</Label>
          <div className="mt-2 space-y-3">
            {/* Features Display as Badges */}
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                  >
                    {feature}
                    <Button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${feature} feature`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Feature Input */}
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                variant="default"
                className="rounded-md px-3 py-2 text-sm font-medium"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {serverError && (
          <div className="bg-danger/10 rounded-md p-3 text-sm text-destructive">{serverError}</div>
        )}
      </form>
    </Modal>
  );
}
