import { cx } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/atom/Badge';
import { Input } from '@/components/atom/Input';

interface TagInputProps {
  id?: string;
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  id,
  placeholder = 'Add tag...',
  tags,
  setTags,
  className,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={cx('w-full', className)}>
      <div className="flex flex-wrap gap-2 rounded-md p-1.5">
        {tags.map((tag, index) => (
          <Badge key={index} variant="default" className="gap-1 px-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
              disabled={disabled}
            >
              <span className="sr-only">Remove {tag}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </Badge>
        ))}
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 border-0 p-0 text-sm focus-visible:ring-0"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

