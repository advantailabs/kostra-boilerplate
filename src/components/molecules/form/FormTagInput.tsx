import { Label } from '@/components/atom/Label';
import { TagInput } from '@/components/molecules/form/TagInput';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormTagInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function FormTagInput<T extends FieldValues>({
  name,
  label,
  control,
  required = false,
  error,
  placeholder = 'Add tag...',
}: FormTagInputProps<T>) {
  return (
    <>
      <Label htmlFor={name} className="block text-sm font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={[] as unknown as T[FieldPath<T>]}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <TagInput
            placeholder={placeholder}
            tags={Array.isArray(value) ? value : []}
            onChange={(newTags: string[]) => {
              const updatedTags = Array.isArray(newTags) ? newTags : [];
              onChange(updatedTags);
            }}
            className={`w-full border-none bg-background ${error ? 'border-danger focus:ring-danger' : 'focus:border-primary'
              }`}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </>
  );
}
