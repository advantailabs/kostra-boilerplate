import { BlogImageUpload } from '@/components/molecules/form/BlogImageUpload';
import { TagInput } from '@/components/molecules/form/TagInput';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
      <Field>
        <FieldLabel htmlFor="title">
          Title
        </FieldLabel>
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
              />
              <FieldError errors={errors.title ? [{ message: errors.title.message }] : []} />
            </>
          )}
        />
      </Field>

      {/* Slug */}
      <Field>
        <FieldLabel htmlFor="slug">
          Slug
        </FieldLabel>
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
              />
              <FieldError errors={errors.slug ? [{ message: errors.slug.message }] : []} />
            </>
          )}
        />
      </Field>

      {/* Categories */}
      <Field>
        <FieldLabel htmlFor="categories">
          Categories
        </FieldLabel>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {categoryOptions.map(option => (
                <div key={option.value} className="inline-flex w-fit items-center space-x-2">
                  <Checkbox
                    id={`category-${option.value}`}
                    checked={field.value?.includes(option.value) || false}
                    onCheckedChange={checked => {
                      const currentValue = field.value || [];
                      const newValue = checked
                        ? [...currentValue, option.value]
                        : currentValue.filter((val: string) => val !== option.value);
                      field.onChange(newValue);
                    }}
                  />
                  <FieldLabel htmlFor={`category-${option.value}`}>
                    {option.label}
                  </FieldLabel>
                </div>
              ))}
            </div>
          )}
        />
        <FieldError errors={errors.categories ? [{ message: errors.categories.message }] : []} />
      </Field>

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
      <Field>
        <FieldLabel htmlFor="tags">
          Tags
        </FieldLabel>
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
        <FieldError errors={errors.tags ? [{ message: errors.tags.message }] : []} />
      </Field>

      {/* Published */}
      <FieldLabel htmlFor="published" className="px-0! border-none!">
        <Field orientation="horizontal" className="px-0!">
          <FieldContent className="cursor-pointer!">
            <FieldTitle>Published</FieldTitle>
            <FieldDescription>
              When enabled, this blog will be visible to the public
            </FieldDescription>
          </FieldContent>
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
        </Field>
      </FieldLabel>
    </>
  );
}
