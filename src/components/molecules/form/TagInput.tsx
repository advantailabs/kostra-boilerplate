import { RiCloseLine } from '@remixicon/react';
import React, { KeyboardEvent, useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (_tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Type and press Enter to add tags',
  className = '',
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-primary/20 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-primary/30 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                aria-label={`Remove ${tag} tag`}
              >
                <RiCloseLine className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length >= maxTags ? `Maximum ${maxTags} tags allowed` : placeholder}
        disabled={tags.length >= maxTags}
        className="w-full rounded-md border border-border bg-background-light px-3 py-2 text-sm text-text placeholder-text-muted focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-background-light disabled:text-text-muted"
      />

      {/* Helper Text */}
      <p className="text-xs text-text-muted">
        {tags.length}/{maxTags} tags • Press Enter or comma to add
      </p>
    </div>
  );
}
