'use client';

import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Switch } from '@/components/atom/Switch';
import { Modal } from '@/components/molecules/common/Modal';
import { useCategories } from '@/hooks/useCategories';
import { useFileUpload } from '@/hooks/useFileUpload';
import { BlogResponseType } from '@/types/blog.type';
import {
  RiCloseLine,
  RiImageAddLine,
  RiText,
  RiPriceTag3Line,
  RiFolderOpenLine,
  RiEyeLine,
} from '@remixicon/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
}

export function BlogModal({ isOpen, onClose, onSubmit, blog, mode }: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    categories: [] as string[],
    blogImageUrl: '',
    published: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const { uploadFile, isUploading } = useFileUpload({
    uploadPurpose: 'BlogImage',
    objectName: 'blog',
    objectId: blog?.id || 0,
    onSuccess: url => {
      setFormData(prev => ({ ...prev, blogImageUrl: url }));
    },
  });

  const { categories } = useCategories();

  useEffect(() => {
    if (mode === 'edit' && blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        categories: blog.categories?.map(cat => cat?.category?.id.toString()) || [],
        blogImageUrl: blog.blogImageUrl || '',
        published: blog.published || false,
      });

      if (blog.blogImageUrl) {
        setBlogImagePreview(blog.blogImageUrl);
      }
    } else if (mode === 'create') {
      setFormData({
        title: '',
        content: '',
        tags: [],
        categories: [],
        blogImageUrl: '',
        published: false,
      });
      setBlogImagePreview(null);
    }
  }, [mode, blog]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Client-side validation
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

        setImageError(null);

        try {
          // Show preview immediately
          const previewUrl = URL.createObjectURL(file);
          setBlogImagePreview(previewUrl);

          // Upload the image
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            setFormData(prev => ({ ...prev, blogImageUrl: uploadedUrl }));
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setImageError('Failed to upload image. Please try again.');
        }
      }
    },
    onDropRejected: rejectedFiles => {
      rejectedFiles.forEach(({ errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            setImageError('File size must be less than 5MB');
          } else if (error.code === 'file-invalid-type') {
            setImageError('Only JPG and PNG files are allowed');
          } else {
            setImageError('File upload failed. Please try again.');
          }
        });
      });
    },
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Basic validation
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (formData.tags.length === 0) errors.tags = 'At least one tag is required';
    if (formData.categories.length === 0) errors.categories = 'At least one category is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      tags: [],
      categories: [],
      blogImageUrl: '',
      published: false,
    });
    setFormErrors({});
    setBlogImagePreview(null);
    setImageError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-6xl"
      title={mode === 'create' ? 'Create Blog' : 'Edit Blog'}
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
        <div className="flex min-h-0 flex-1">
          {/* Left Side */}
          <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-gray-200 p-6 md:w-[450px]">
            {/* Title */}
            <div>
              <div className="mb-2 flex items-center gap-1">
                <RiText className="h-4 w-4" />
                <Label htmlFor="title">Title</Label>
              </div>
              <Input
                id="title"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="Enter blog title..."
                className="h-9"
              />
              {formErrors.title && <span className="text-sm text-red-500">{formErrors.title}</span>}
            </div>

            {/* Tags */}
            <div>
              <div className="mb-2 flex items-center gap-1">
                <RiPriceTag3Line className="h-4 w-4" />
                <Label htmlFor="tags">Tags</Label>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="hover:text-indigo-600"
                      >
                        <RiCloseLine className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add a tag and press Enter"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        handleTagAdd(value);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  className="h-9"
                />
              </div>
              {formErrors.tags && <span className="text-sm text-red-500">{formErrors.tags}</span>}
            </div>

            {/* Categories */}
            <div>
              <div className="mb-2 flex items-center gap-1">
                <RiFolderOpenLine className="h-4 w-4" />
                <Label htmlFor="categories">Categories</Label>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {categories?.map(category => (
                  <div
                    key={category.id}
                    className="inline-flex w-fit items-center space-x-2 rounded-md border border-gray-100 p-2 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.categories.includes(category.id.toString())}
                      onChange={() => handleCategoryToggle(category.id.toString())}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              {formErrors.categories && (
                <span className="text-sm text-red-500">{formErrors.categories}</span>
              )}
            </div>

            {/* Published */}
            <div>
              <div className="flex items-center justify-between">
                <div className="mb-2 flex items-center gap-1">
                  <RiEyeLine className="h-4 w-4" />
                  <Label htmlFor="published">Published</Label>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={checked => handleInputChange('published', checked)}
                />
              </div>
              <p className="text-xs text-gray-500">
                When enabled, this blog will be visible to the public
              </p>
            </div>

            {/* Blog Image */}
            <div>
              <div className="mb-2 flex items-center gap-1">
                <RiImageAddLine className="h-4 w-4" />
                <Label htmlFor="blogImageUrl">
                  Blog Image <span className="text-red-500">*</span>
                </Label>
              </div>
              <div
                {...getRootProps()}
                className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition-colors hover:border-indigo-500 hover:bg-indigo-50 ${
                  isUploading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <input {...getInputProps()} disabled={isUploading} />
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                    <span className="text-sm font-medium text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <RiImageAddLine className="mb-3 h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {blogImagePreview ? 'Click to change image' : 'Upload Blog Image *'}
                    </span>
                    <span className="mt-1 text-xs text-gray-400">
                      .jpg, .png up to 5MB (Required)
                    </span>
                  </>
                )}
              </div>

              {/* Image Preview */}
              {blogImagePreview && (
                <div className="relative mt-3">
                  <Label className="text-sm text-gray-600">Preview:</Label>
                  <div className="relative h-32 w-full rounded-lg border border-gray-200 bg-gray-50">
                    <Image
                      src={blogImagePreview}
                      alt="Blog Image Preview"
                      fill
                      className="rounded-lg object-contain"
                    />
                    {/* X Button to Remove Image */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setBlogImagePreview(null);
                        setFormData(prev => ({ ...prev, blogImageUrl: '' }));
                      }}
                      className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-black shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <RiCloseLine className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}
            </div>
          </div>

          {/* Right Side - Content Editor */}
          <div className="flex min-w-0 flex-1 flex-col p-6">
            <div className="mb-2 flex items-center gap-1">
              <RiText className="h-4 w-4" />
              <Label htmlFor="content">Content</Label>
            </div>
            <textarea
              id="content"
              value={formData.content}
              onChange={e => handleInputChange('content', e.target.value)}
              placeholder="Write your blog content here..."
              className="min-h-[400px] flex-1 resize-none rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.content && (
              <span className="text-sm text-red-500">{formErrors.content}</span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
