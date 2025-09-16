import { createBlogSchemaFrontend, updateBlogSchemaFrontend } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type BlogFormData = z.infer<typeof createBlogSchemaFrontend>;

interface UseBlogFormProps {
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onSubmit: (data: FormData) => void;
}

export function useBlogForm({ blog, mode, isOpen, onSubmit }: UseBlogFormProps) {
  const [formInitialized, setFormInitialized] = useState(false);

  const schema = mode === 'create' ? createBlogSchemaFrontend : updateBlogSchemaFrontend;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(schema),
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

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setFormInitialized(false);
    }
  }, [isOpen, form]);

  // Populate form with blog data when it's loaded (for edit mode)
  useEffect(() => {
    if (blog && isOpen && mode === 'edit' && !formInitialized) {
      form.reset(
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
      setFormInitialized(true);
    }
  }, [blog, form, isOpen, mode, formInitialized]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
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
        const fileKey = mode === 'create' ? 'imageFile' : 'blogImageFile';
        formData.append(fileKey, data.imageFile);
      }

      onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const resetForm = () => {
    form.reset();
    setFormInitialized(false);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
    formInitialized,
  };
}
