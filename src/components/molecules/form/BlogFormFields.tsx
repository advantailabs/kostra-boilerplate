import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Switch } from '@/components/atom/Switch';
import { BlogImageUpload } from '@/components/molecules/form/BlogImageUpload';
import { TagInput } from '@/components/molecules/form/TagInput';
import { BlogResponseType } from '@/types/blog.type';
import { Control, Controller, FieldErrors } from 'react-hook-form';

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

interface CategoryOption {
  value: string;
  label: string;
}

interface BlogFormFieldsProps {
  control: Control<BlogFormData>;
  errors: FieldErrors<BlogFormData>;
  categoryOptions: CategoryOption[];
  blog?: BlogResponseType | null;
}

export function BlogFormFields({ control, errors, categoryOptions, blog }: BlogFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <Label htmlFor="title" className="mb-2 block text-sm font-medium text-text">
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
              {errors.title && <span className="text-sm text-danger">{errors.title.message}</span>}
            </>
          )}
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className="mb-2 block text-sm font-medium text-text">
          Slug
        </Label>
        <Controller
          control={control}
          name="slug"
          render={({ field }) => (
            <>
              <Input
                id="slug"
                {...field}
                value={String(field.value ?? '')}
                placeholder="Enter blog slug..."
                className="h-9"
              />
              {errors.slug && <span className="text-sm text-danger">{errors.slug.message}</span>}
            </>
          )}
        />
      </div>

      {/* Categories */}
      <div>
        <Label htmlFor="categories" className="mb-2 block text-sm font-medium text-text">
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
                    checked={field.value?.includes(option.value) || false}
                    onChange={e => {
                      const currentValue = field.value || [];
                      const newValue = e.target.checked
                        ? [...currentValue, option.value]
                        : currentValue.filter((val: string) => val !== option.value);
                      field.onChange(newValue);
                    }}
                    className="h-3 w-3 rounded border-border text-primary focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor={`category-${option.value}`} className="text-sm text-text">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.categories && typeof errors.categories.message === 'string' && (
          <span className="text-sm text-danger">{errors.categories.message}</span>
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
            label="Blog Image"
            required
            objectId={blog?.id || 0}
          />
        )}
      />

      {/* Separator */}
      <div className="-mx-4 border-t border-border" />

      {/* Tags */}
      <div>
        <Label htmlFor="tags" className="mb-2 block text-sm font-medium text-text">
          Tags
        </Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              tags={field.value || []}
              onChange={tags => field.onChange(tags)}
              placeholder="Add tags..."
              maxTags={10}
            />
          )}
        />
        {errors.tags && <span className="text-sm text-danger">{errors.tags.message}</span>}
      </div>

      {/* Published */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="published" className="mb-2 block text-sm font-medium text-text">
            Published
          </Label>
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                id="published"
                checked={field.value || false}
                onCheckedChange={checked => field.onChange(checked)}
              />
            )}
          />
        </div>
        <p className="-mt-2 text-xs text-text-muted">
          When enabled, this blog will be visible to the public
        </p>
      </div>
    </>
  );
}
