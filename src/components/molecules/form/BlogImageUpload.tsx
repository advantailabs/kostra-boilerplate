import { Label } from '@/components/atom/Label';
import { useFileUpload } from '@/hooks/useFileUpload';
import { RiCloseLine, RiImageAddLine } from '@remixicon/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface BlogImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onFileChange?: (file: File) => void;
  label?: string;
  required?: boolean;
  className?: string;
  objectId?: number;
}

export function BlogImageUpload({
  value,
  onChange,
  onFileChange,
  label = 'Blog Image',
  required = false,
  className = '',
  objectId = 0,
}: BlogImageUploadProps) {
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadFile,
    isUploading,
    error: uploadError,
    clearError,
  } = useFileUpload({
    uploadPurpose: 'BlogImage',
    objectName: 'blog',
    objectId,
    onSuccess: url => {
      onChange(url);
      setImageError(null);
    },
  });

  const handleImageClick = () => {
    clearError();
    setImageError(null);
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Additional client-side validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize) {
      setImageError('File size must be less than 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG and PNG files are allowed');
      return;
    }

    try {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl && onFileChange) {
        onFileChange(file);
      }
    } catch (error) {
      console.error('Error uploading blog image:', error);
      setImageError('Failed to upload image. Please try again.');
    }

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setImageError(null);
    clearError();
  };

  const displayError = imageError || uploadError;

  return (
    <div className={className}>
      <Label
        htmlFor="blogImage"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <div
          className={`relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all md:h-[140px] ${
            isUploading ? 'cursor-not-allowed opacity-50' : ''
          } ${
            displayError
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950/20'
              : value
                ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          }`}
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleImageClick();
            }
          }}
          aria-label="Upload blog image"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading}
            id="blogImage"
          />

          {value ? (
            <div className="relative h-full w-full rounded-lg">
              <Image
                src={value}
                alt="Blog image preview"
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              {/* Remove Image Button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                aria-label="Remove image"
              >
                <RiCloseLine className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <RiImageAddLine className="mb-2 h-8 w-8" />
              <span className="text-sm font-medium text-gray-600">
                {isUploading ? 'Uploading...' : 'Upload Blog Image'}
              </span>
              <span className="mt-1 text-xs text-gray-400">
                .jpg, .png up to 5MB {required && '(Required)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {displayError && <p className="mt-2 text-xs text-red-500">{displayError}</p>}

      {isUploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
    </div>
  );
}
