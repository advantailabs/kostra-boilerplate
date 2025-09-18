import { Label } from '@/components/atom/Label';
import { TagInput } from '@/components/molecules/form/TagInput';
import { Controller } from 'react-hook-form';

interface FormTagInputProps {
  name: string;
  label: string;
  control: any;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function FormTagInput({
  name,
  label,
  control,
  required = false,
  error,
  placeholder = 'Add tag...',
}: FormTagInputProps) {
  return (
    <>
      <Label htmlFor={name} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <TagInput
            placeholder={placeholder}
            tags={Array.isArray(value) ? value : []}
            onChange={(newTags: string[]) => {
              const updatedTags = Array.isArray(newTags) ? newTags : [];
              onChange(updatedTags);
            }}
            className={`w-full border-none bg-white dark:bg-[#0a0b14] ${
              error ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500'
            }`}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}
