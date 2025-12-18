'use client';

import { Badge } from '@/components/atom/Badge';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Switch } from '@/components/atom/Switch';
import { Textarea } from '@/components/atom/Textarea';
import { Modal } from '@/components/molecules/common/Modal';
import { usePackages } from '@/hooks/usePackages';
import { RiCloseLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

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
  onSubmit: (_data: any) => void;
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isFeatured: false,
    price: 0,
    currencySymbol: '$',
    features: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');

  const { createPackage, updatePackage, isCreating, isUpdating } = usePackages({
    page: currentPage,
    limit: currentLimit,
    title: currentSearch,
  });
  const isLoading = mode === 'create' ? isCreating : isUpdating;

  useEffect(() => {
    if (mode === 'edit' && pkg) {
      // Convert Decimal string to number if needed
      const priceValue = typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price;
      setFormData({
        title: pkg.title || '',
        description: pkg.description || '',
        isFeatured: pkg.isFeatured || false,
        price: priceValue || 0,
        currencySymbol: pkg.currencySymbol || '$',
        features: pkg.features || [],
      });
      setPriceDisplay(priceValue === 0 ? '' : priceValue.toString());
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        isFeatured: false,
        price: 0,
        currencySymbol: '$',
        features: [],
      });
      setPriceDisplay('');
    }
  }, [mode, pkg]);

  const handleInputChange = (field: string, value: any) => {
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
      maxWidth="max-w-2xl"
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
          <div className="sm:col-span-2">
            <Label htmlFor="title">
              Title <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Enter package title..."
              className="mt-1"
            />
            {formErrors.title && <span className="text-sm text-danger">{formErrors.title}</span>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <Label htmlFor="description">
              Description <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Enter package description..."
              className="mt-1 resize-none"
              rows={3}
              style={{ height: '80px', minHeight: '80px', maxHeight: '80px' }}
            />
            {formErrors.description && (
              <span className="text-sm text-danger">{formErrors.description}</span>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">
              Price <span className="text-danger">*</span>
            </Label>
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
            {formErrors.price && <span className="text-sm text-danger">{formErrors.price}</span>}
          </div>

          {/* Currency Symbol */}
          <div>
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={formData.currencySymbol}
              onChange={handleCurrencySymbolChange}
              placeholder="$"
              className="mt-1"
              maxLength={4}
            />
            {formErrors.currencySymbol ? (
              <span className="text-sm text-danger">{formErrors.currencySymbol}</span>
            ) : (
              <span className="text-xs text-text-muted">Examples: $, €, £, ¥, ₹</span>
            )}
          </div>

          {/* Featured */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured Package</Label>
                <p className="text-sm text-text-muted">Mark this package as featured</p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={checked => handleInputChange('isFeatured', checked)}
              />
            </div>
          </div>
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
                    variant="neutral"
                    className="inline-flex items-center gap-1 px-3 py-1 !bg-primary/30 !text-primary !ring-primary"
                  >
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="hover:bg-primary/20 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                      aria-label={`Remove ${feature} feature`}
                    >
                      <RiCloseLine className="h-3 w-3" />
                    </button>
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
              <button
                type="button"
                onClick={handleAddFeature}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {serverError && (
          <div className="bg-danger/10 rounded-md p-3 text-sm text-danger">{serverError}</div>
        )}
      </form>
    </Modal>
  );
}
