import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
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
            <Badge
              key={index}
              variant="outline"
            >
              {tag}
              <Button
                type="button"
                onClick={() => removeTag(index)}
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <Input
        id="tags"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length >= maxTags ? `Maximum ${maxTags} tags allowed` : placeholder}
        disabled={tags.length >= maxTags}
        className=""
      />

      {/* Helper Text */}
      <FieldDescription>
        {tags.length}/{maxTags} tags • Press Enter or comma to add
      </FieldDescription>
    </div>
  );
}
