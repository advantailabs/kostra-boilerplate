'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Switch } from '@/components/atom/Switch';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import Editor from '@/components/molecules/editor/Editor';
import { FormTagInput } from '@/components/molecules/form/FormTagInput';
import { useCategories } from '@/hooks/useCategories';
import { useFileUpload } from '@/hooks/useFileUpload';
import { createBlogSchemaFrontend, updateBlogSchemaFrontend } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, FolderOpen, ImageIcon, Tag, Type, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
}

export function BlogModal({ isOpen, onClose, onSubmit, blog, mode }: BlogModalProps) {
  const [blogImageUrl, setBlogImageUrl] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Upload image hook for blog image
  const { uploadFile: uploadBlogImage, isUploading: isUploadingImage } = useFileUpload({
    uploadPurpose: 'BlogImage',
    objectName: 'blog',
    objectId: blog?.id || 0,
    onSuccess: url => {
      setBlogImageUrl(url);
    },
  });

  // Create blog form
  const createBlogForm = useForm<z.infer<typeof createBlogSchemaFrontend>>({
    resolver: zodResolver(createBlogSchemaFrontend),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      blogImageUrl: '',
      imageFile: undefined,
      categories: [],
      published: false,
    },
  });

  // Edit blog form
  const editBlogForm = useForm<z.infer<typeof updateBlogSchemaFrontend>>({
    resolver: zodResolver(updateBlogSchemaFrontend),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      blogImageUrl: '',
      imageFile: undefined,
      categories: [],
      published: false,
    },
  });

  // Blog categories options
  const { categories } = useCategories();

  const categoryOptions =
    categories?.map((category: { id: number; name: string }) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      if (mode === 'create') {
        createBlogForm.reset();
      } else {
        editBlogForm.reset();
      }

      // Clean up object URL if it exists
      if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blogImageUrl);
      }
      setBlogImageUrl(null);
      setFormInitialized(false);
      setImageError(null);
    }
  }, [isOpen, mode, createBlogForm, editBlogForm, blogImageUrl]);

  // Cleanup object URL when component unmounts or blogImageUrl changes
  useEffect(() => {
    return () => {
      if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blogImageUrl);
      }
    };
  }, [blogImageUrl]);

  // Populate form with blog data when it's loaded (for edit mode)
  useEffect(() => {
    if (blog && isOpen && mode === 'edit' && !formInitialized) {
      editBlogForm.reset(
        {
          title: blog.title || '',
          content: blog.content || '',
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          blogImageUrl: blog.blogImageUrl || '',
          imageFile: undefined,
          published: blog.published || false,
          categories: blog.categories?.map(cat => cat?.category?.id.toString()) || [],
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );

      if (blog.blogImageUrl) {
        // Add cache-busting parameter to the image URL
        const timestamp = Date.now();
        setBlogImageUrl(`${blog.blogImageUrl}?v=${timestamp}`);
      }

      setFormInitialized(true);
    }
  }, [blog, editBlogForm, isOpen, mode, formInitialized]);

  // Handle create form submission
  const onCreateSubmit = async (data: z.infer<typeof createBlogSchemaFrontend>) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Add all form fields to FormData except imageFile
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image file if available (for backward compatibility)
      if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
      }

      // Call the API with FormData using callbacks
      onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  // Handle edit form submission
  const onEditSubmit = async (data: z.infer<typeof updateBlogSchemaFrontend>) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'imageFile') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image file if available
      if (data.imageFile) {
        formData.append('blogImageFile', data.imageFile);
      }

      // Call the API with FormData using callbacks
      onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

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

        // Clean up previous object URL if it exists
        if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blogImageUrl);
        }

        // Clear any previous errors
        setImageError(null);

        try {
          // Show preview immediately
          const previewUrl = URL.createObjectURL(file);
          setBlogImageUrl(previewUrl);

          // Upload the image using the hook
          const publicUrl = await uploadBlogImage(file);

          if (publicUrl) {
            // Update the form with the public URL
            if (mode === 'create') {
              createBlogForm.setValue('blogImageUrl', publicUrl);
              createBlogForm.setValue('imageFile', file);
              createBlogForm.trigger('imageFile');
            } else {
              editBlogForm.setValue('blogImageUrl', publicUrl);
              editBlogForm.setValue('imageFile', file);
              editBlogForm.trigger('imageFile');
            }

            // Update the preview with the public URL
            setBlogImageUrl(publicUrl);
          }
        } catch (error) {
          console.error('Error uploading blog image:', error);
          setImageError('Failed to upload image. Please try again.');
          // Clean up the preview URL
          if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(blogImageUrl);
          }
          setBlogImageUrl(null);
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

  const handleClose = () => {
    if (mode === 'create') {
      createBlogForm.reset();
    } else {
      editBlogForm.reset();
    }

    // Clean up object URL if it exists
    if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blogImageUrl);
    }
    setBlogImageUrl(null);
    setFormInitialized(false);
    setImageError(null);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={newOpen => {
          if (!newOpen) {
            handleClose();
          }
        }}
      >
        <DialogContent className="custom-modal-class z-[1000] flex h-[90vh] max-h-[1000px] w-[95vw] max-w-[2000px] flex-col border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-800 dark:bg-[#0a0b14]">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-indigo-300 p-2 dark:bg-indigo-300">
                  <Type className="h-5 w-5 text-indigo-600 dark:text-indigo-600" />
                </div>
                <DialogTitle className="text-xl">
                  {mode === 'create' ? 'Create Blog' : 'Edit Blog'}
                </DialogTitle>
              </div>
              <DialogClose className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>

            {/* Main Content */}
            <form
              onSubmit={
                mode === 'create'
                  ? createBlogForm.handleSubmit(onCreateSubmit)
                  : editBlogForm.handleSubmit(onEditSubmit)
              }
              className="flex flex-1 flex-col"
            >
              <div className="flex min-h-0 flex-1">
                {/* Left Side */}
                <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 border-r border-gray-200 p-6 [-ms-overflow-style:none] [scrollbar-width:none] md:w-[450px] dark:border-gray-800">
                  {/* Title */}
                  <div>
                    <div className="mb-2 flex items-center gap-1">
                      <Type className="h-4 w-4" />
                      <Label htmlFor="title">Title</Label>
                    </div>
                    {mode === 'create' ? (
                      <Controller<z.infer<typeof createBlogSchemaFrontend>>
                        control={createBlogForm.control}
                        name="title"
                        render={({ field }) => (
                          <>
                            <Input
                              id="title"
                              {...field}
                              value={String(field.value ?? '')}
                              placeholder="Enter blog title..."
                              className="h-9"
                            />
                            {createBlogForm.formState.errors.title && (
                              <span className="text-sm text-red-500">
                                {createBlogForm.formState.errors.title.message}
                              </span>
                            )}
                          </>
                        )}
                      />
                    ) : (
                      <Controller<z.infer<typeof updateBlogSchemaFrontend>>
                        control={editBlogForm.control}
                        name="title"
                        render={({ field }) => (
                          <>
                            <Input
                              id="title"
                              {...field}
                              value={String(field.value ?? '')}
                              placeholder="Enter blog title..."
                              className="h-9"
                            />
                            {editBlogForm.formState.errors.title && (
                              <span className="text-sm text-red-500">
                                {editBlogForm.formState.errors.title.message}
                              </span>
                            )}
                          </>
                        )}
                      />
                    )}
                  </div>
                  {/* Tags */}
                  <div>
                    <div className="mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <Label htmlFor="tags">Tags</Label>
                    </div>
                    {mode === 'create' ? (
                      <Controller<z.infer<typeof createBlogSchemaFrontend>>
                        control={createBlogForm.control}
                        name="tags"
                        render={() => (
                          <FormTagInput
                            name="tags"
                            label=""
                            control={createBlogForm.control}
                            placeholder="Add tags..."
                          />
                        )}
                      />
                    ) : (
                      <Controller<z.infer<typeof updateBlogSchemaFrontend>>
                        control={editBlogForm.control}
                        name="tags"
                        render={() => (
                          <FormTagInput
                            name="tags"
                            label=""
                            control={editBlogForm.control}
                            placeholder="Add tags..."
                          />
                        )}
                      />
                    )}
                    {mode === 'create' && createBlogForm.formState.errors.tags && (
                      <span className="text-sm text-red-500">
                        {createBlogForm.formState.errors.tags.message}
                      </span>
                    )}
                    {mode === 'edit' && editBlogForm.formState.errors.tags && (
                      <span className="text-sm text-red-500">
                        {editBlogForm.formState.errors.tags.message}
                      </span>
                    )}
                  </div>
                  {/* Categories */}
                  <div>
                    <div className="mb-2 flex items-center gap-1">
                      <FolderOpen className="h-4 w-4" />
                      <Label htmlFor="categories">Categories</Label>
                    </div>
                    {mode === 'create' ? (
                      <Controller<z.infer<typeof createBlogSchemaFrontend>>
                        control={createBlogForm.control}
                        name="categories"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {categoryOptions.map(option => (
                              <div
                                key={option.value}
                                className="inline-flex w-fit items-center space-x-2 rounded-md border border-gray-100 p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                              >
                                <input
                                  type="checkbox"
                                  id={`category-${option.value}`}
                                  checked={
                                    (field.value as string[])?.includes(option.value) || false
                                  }
                                  onChange={e => {
                                    const currentValue = (field.value as string[]) || [];
                                    const newValue = e.target.checked
                                      ? [...currentValue, option.value]
                                      : currentValue.filter(val => val !== option.value);
                                    field.onChange(newValue);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`category-${option.value}`}
                                  className="text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    ) : (
                      <Controller<z.infer<typeof updateBlogSchemaFrontend>>
                        control={editBlogForm.control}
                        name="categories"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {categoryOptions.map(option => (
                              <div
                                key={option.value}
                                className="inline-flex w-fit items-center space-x-2 rounded-md border border-gray-100 p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                              >
                                <input
                                  type="checkbox"
                                  id={`category-${option.value}`}
                                  checked={
                                    (field.value as string[])?.includes(option.value) || false
                                  }
                                  onChange={e => {
                                    const currentValue = (field.value as string[]) || [];
                                    const newValue = e.target.checked
                                      ? [...currentValue, option.value]
                                      : currentValue.filter(val => val !== option.value);
                                    field.onChange(newValue);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`category-${option.value}`}
                                  className="text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    )}
                    {mode === 'create' &&
                      createBlogForm.formState.errors.categories &&
                      typeof createBlogForm.formState.errors.categories.message === 'string' && (
                        <span className="text-sm text-red-500">
                          {createBlogForm.formState.errors.categories.message}
                        </span>
                      )}
                    {mode === 'edit' &&
                      editBlogForm.formState.errors.categories &&
                      typeof editBlogForm.formState.errors.categories.message === 'string' && (
                        <span className="text-sm text-red-500">
                          {editBlogForm.formState.errors.categories.message}
                        </span>
                      )}
                  </div>
                  {/* Published */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="mb-2 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <Label htmlFor="published">Published</Label>
                      </div>
                      {mode === 'create' ? (
                        <Controller<z.infer<typeof createBlogSchemaFrontend>>
                          control={createBlogForm.control}
                          name="published"
                          render={({ field }) => (
                            <Switch
                              id="published"
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      ) : (
                        <Controller<z.infer<typeof updateBlogSchemaFrontend>>
                          control={editBlogForm.control}
                          name="published"
                          render={({ field }) => (
                            <Switch
                              id="published"
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      When enabled, this blog will be visible to the public
                    </p>
                  </div>
                  {/* Blog Image */}
                  <div>
                    <div className="mb-2 flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <Label htmlFor="blogImageUrl">
                        Blog Image <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div
                      {...getRootProps()}
                      className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition-colors hover:border-indigo-500 hover:bg-indigo-50 md:h-[140px] md:p-6 dark:border-gray-700 dark:bg-gray-800 ${
                        isUploadingImage ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <input {...getInputProps()} disabled={isUploadingImage} />
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
                          <span className="text-sm font-medium text-gray-600">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <svg
                            width="32"
                            height="32"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="mb-3 text-gray-400"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="16"
                              height="16"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 16l2.5-3 2.5 3 3.5-4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">
                            {blogImageUrl ? 'Click to change image' : 'Upload Blog Image *'}
                          </span>
                          <span className="mt-1 text-xs text-gray-400">
                            .jpg, .png up to 5MB (Required)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Image Preview */}
                    {blogImageUrl && (
                      <div className="relative mt-3">
                        <Label className="text-sm text-gray-600 dark:text-gray-400">Preview:</Label>
                        <div className="relative h-32 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                          <Image
                            loader={({ src }) => src}
                            src={blogImageUrl}
                            alt="Blog Image Preview"
                            fill
                            className="rounded-lg object-contain"
                          />
                          {/* X Button to Remove Image */}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              if (blogImageUrl && blogImageUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(blogImageUrl);
                              }
                              setBlogImageUrl(null);
                              if (mode === 'create') {
                                createBlogForm.setValue('blogImageUrl', '');
                              } else {
                                editBlogForm.setValue('blogImageUrl', '');
                              }
                            }}
                            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-black shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}
                    {mode === 'create' &&
                      createBlogForm.formState.errors.imageFile &&
                      typeof createBlogForm.formState.errors.imageFile.message === 'string' && (
                        <p className="mt-2 text-xs text-red-500">
                          {createBlogForm.formState.errors.imageFile.message}
                        </p>
                      )}
                    {mode === 'edit' &&
                      editBlogForm.formState.errors.imageFile &&
                      typeof editBlogForm.formState.errors.imageFile.message === 'string' && (
                        <p className="mt-2 text-xs text-red-500">
                          {editBlogForm.formState.errors.imageFile.message}
                        </p>
                      )}
                  </div>
                </div>
                {/* Right Side */}
                <div
                  className="flex h-[740px] min-w-0 flex-1 p-0"
                  onClick={e => e.stopPropagation()}
                >
                  {mode === 'create' ? (
                    <Controller<z.infer<typeof createBlogSchemaFrontend>>
                      control={createBlogForm.control}
                      name="content"
                      render={({ field }) => (
                        <div
                          className="flex min-h-0 w-full flex-1 flex-col p-2"
                          onClick={e => e.stopPropagation()}
                        >
                          <Editor
                            initialContent={String(field.value || '')}
                            onContentChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  ) : (
                    <Controller<z.infer<typeof updateBlogSchemaFrontend>>
                      control={editBlogForm.control}
                      name="content"
                      render={({ field }) => (
                        <div
                          className="flex h-[690px] min-h-0 w-full flex-1 flex-col p-2"
                          onClick={e => e.stopPropagation()}
                        >
                          <Editor
                            initialContent={String(field.value || '')}
                            onContentChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  )}
                  {mode === 'create' && createBlogForm.formState.errors.content && (
                    <span className="absolute right-1/2 top-1/2 text-sm text-red-500">
                      {createBlogForm.formState.errors.content.message}
                    </span>
                  )}
                  {mode === 'edit' && editBlogForm.formState.errors.content && (
                    <span className="text-sm text-red-500">
                      {editBlogForm.formState.errors.content.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Footer */}
              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">{mode === 'create' ? 'Create Blog' : 'Update Blog'}</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
