import { createBlogSchema, updateBlogSchema } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// Type for the form data (before transformation)
type BlogFormData = {
  title: string;
  content: string;
  tags: string;
  categories: string;
  blogImageUrl?: string;
  published?: string;
};

interface UseBlogFormProps {
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onSubmit: (_data: FormData) => void;
}

export function useBlogForm({ blog, mode, isOpen, onSubmit }: UseBlogFormProps) {
  const [formInitialized, setFormInitialized] = useState(false);

  const schema = mode === 'create' ? createBlogSchema : updateBlogSchema;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      tags: '[]',
      blogImageUrl: '',
      categories: '[]',
      published: 'false',
    },
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setFormInitialized(false);
    }
  }, [isOpen, form]);

  // Handle form initialization based on mode and blog data
  useEffect(() => {
    if (!isOpen) return;

    // Reset form and initialization state when mode changes
    form.reset();
    setFormInitialized(false);

    // If in edit mode and we have blog data, populate the form
    if (mode === 'edit' && blog) {
      form.reset(
        {
          title: blog.title || '',
          content: blog.content || '',
          tags: Array.isArray(blog.tags) ? JSON.stringify(blog.tags) : '[]',
          blogImageUrl: blog.blogImageUrl || '',
          published: blog.published ? 'true' : 'false',
          categories: blog.categories?.map(cat => cat?.category?.id.toString())
            ? JSON.stringify(blog.categories.map(cat => cat?.category?.id.toString()))
            : '[]',
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
      setFormInitialized(true);
    } else if (mode === 'create') {
      // For create mode, just reset to default values
      form.reset({
        title: '',
        content: '',
        tags: '[]',
        blogImageUrl: '',
        categories: '[]',
        published: 'false',
      });
      setFormInitialized(true);
    }
  }, [mode, blog, isOpen, form]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      const formData = new FormData();

      // Add all form fields to FormData (data already contains string values)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

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
