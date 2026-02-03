import { Field, FieldLabel } from '@/components/ui/field';
import { useFileUpload } from '@/hooks/useFileUpload';
import { S3_PUBLIC_BASE_URL } from '@/services/external/aws/s3';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';

/** Returns true only for absolute URLs that next/image accepts (http/https). */
function isValidImageSrc(src: string): boolean {
  if (!src || typeof src !== 'string') return false;
  try {
    const url = new URL(src);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Builds a URL safe for next/image: either value as-is if absolute, or S3 public base + key. */
function getDisplayImageUrl(value: string): string | null {
  if (!value || typeof value !== 'string') return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (S3_PUBLIC_BASE_URL) {
    const key = value.replace(/^\//, '');
    const url = `${S3_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`;
    return isValidImageSrc(url) ? url : null;
  }
  return null;
}

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
  const displayUrl = useMemo(() => getDisplayImageUrl(value), [value]);

  return (
    <Field className={className}>
      <FieldLabel htmlFor="blogImage">
        {label} {required && <span className="text-danger">*</span>}
      </FieldLabel>

      <div className="relative">
        <div
          className={`relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all md:h-[140px] ${isUploading ? 'cursor-not-allowed opacity-50' : ''
            } ${displayError
              ? 'bg-danger/10 border-danger'
              : value
                ? 'border-border bg-background-light'
                : 'border-border bg-background-light'
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

          {displayUrl ? (
            <div className="relative h-full w-full rounded-lg">
              <Image
                src={displayUrl}
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
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white transition-colors hover:bg-danger-hover"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted">
              <ImagePlus className="mb-2 size-8" />
              <span className="text-sm font-medium text-text">
                {isUploading ? 'Uploading...' : 'Upload Blog Image'}
              </span>
              <span className="mt-1 text-xs text-text-muted">
                .jpg, .png up to 5MB {required && '(Required)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {displayError && <p className="mt-2 text-xs text-danger">{displayError}</p>}

      {isUploading && <p className="mt-2 text-xs text-text-muted">Uploading...</p>}
    </Field>
  );
}
