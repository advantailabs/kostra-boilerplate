import {
  CreateBlogInput,
  createBlogSchema,
  UpdateBlogInput,
  updateBlogSchema,
} from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Type for the form data (proper types)
type BlogFormData = {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  categories: string[];
  blogImageUrl?: string;
  published?: boolean;
};

interface UseBlogFormProps {
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onSubmit: (_data: CreateBlogInput | UpdateBlogInput) => void;
}

export function useBlogForm({ blog, mode, isOpen, onSubmit }: UseBlogFormProps) {
  const schema = mode === 'create' ? createBlogSchema : updateBlogSchema;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      tags: [],
      blogImageUrl: '',
      categories: [],
      published: false,
    },
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  // Handle form initialization based on mode and blog data
  useEffect(() => {
    if (!isOpen) return;

    // Reset form and initialization state when mode changes
    form.reset();

    // If in edit mode and we have blog data, populate the form
    if (mode === 'edit' && blog) {
      form.reset(
        {
          title: blog.title || '',
          slug: blog.slug || '',
          content: blog.content || '',
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          blogImageUrl: blog.blogImageUrl || '',
          published: blog.published || false,
          categories: blog.categories?.map(cat => cat?.category?.id.toString()) || [],
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
    } else if (mode === 'create') {
      // For create mode, just reset to default values
      form.reset({
        title: '',
        slug: '',
        content: '',
        tags: [],
        blogImageUrl: '',
        categories: [],
        published: false,
      });
    }
  }, [mode, blog, isOpen, form]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      // Prepare data for API (already in correct format)
      const apiData = {
        ...data,
        blogImageUrl: data.blogImageUrl?.trim() || undefined,
      };

      onSubmit(apiData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
  };
}
