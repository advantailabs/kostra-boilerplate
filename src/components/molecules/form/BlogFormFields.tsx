import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Switch } from '@/components/atom/Switch';
import { BlogImageUpload } from '@/components/molecules/form/BlogImageUpload';
import { TagInput } from '@/components/molecules/form/TagInput';
import { createBlogSchemaFrontend } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { z } from 'zod';

type BlogFormData = z.infer<typeof createBlogSchemaFrontend>;

interface CategoryOption {
  value: string;
  label: string;
}

interface BlogFormFieldsProps {
  control: Control<BlogFormData>;
  errors: FieldErrors<BlogFormData>;
  categoryOptions: CategoryOption[];
  blog?: BlogResponseType | null;
  onImageFileChange: (file: File | undefined) => void;
}

export function BlogFormFields({
  control,
  errors,
  categoryOptions,
  blog,
  onImageFileChange,
}: BlogFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <Label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </Label>
        <Controller
          control={control}
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
              {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
            </>
          )}
        />
      </div>

      {/* Categories */}
      <div>
        <Label
          htmlFor="categories"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Categories
        </Label>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {categoryOptions.map(option => (
                <div key={option.value} className="inline-flex w-fit items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${option.value}`}
                    checked={(field.value as string[])?.includes(option.value) || false}
                    onChange={e => {
                      const currentValue = (field.value as string[]) || [];
                      const newValue = e.target.checked
                        ? [...currentValue, option.value]
                        : currentValue.filter(val => val !== option.value);
                      field.onChange(newValue);
                    }}
                    className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-0 focus:ring-offset-0"
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
        {errors.categories && typeof errors.categories.message === 'string' && (
          <span className="text-sm text-red-500">{errors.categories.message}</span>
        )}
      </div>

      {/* Blog Image */}
      <Controller
        control={control}
        name="blogImageUrl"
        render={({ field }) => (
          <BlogImageUpload
            value={field.value || ''}
            onChange={field.onChange}
            onFileChange={onImageFileChange}
            label="Blog Image"
            required={true}
            objectId={blog?.id || 0}
          />
        )}
      />

      {/* Separator */}
      <div className="-mx-4 border-t border-gray-200 dark:border-gray-700"></div>

      {/* Tags */}
      <div>
        <Label
          htmlFor="tags"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Tags
        </Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              tags={field.value || []}
              onChange={field.onChange}
              placeholder="Add tags..."
              maxTags={10}
            />
          )}
        />
        {errors.tags && <span className="text-sm text-red-500">{errors.tags.message}</span>}
      </div>

      {/* Published */}
      <div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="published"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Published
          </Label>
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                id="published"
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        <p className="-mt-2 text-xs text-gray-500 dark:text-gray-400">
          When enabled, this blog will be visible to the public
        </p>
      </div>
    </>
  );
}
