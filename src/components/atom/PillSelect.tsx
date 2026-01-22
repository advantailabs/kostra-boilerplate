 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/molecules/common/Select';
import React from 'react';

interface PillSelectProps {
   
  value: string;
  onValueChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  displayValue?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  className?: string;
}

export function PillSelect({
  value,
  onValueChange,
  icon,
  placeholder = 'Select...',
  displayValue,
  options,
  className = '',
}: PillSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`h-5 w-auto min-w-fit rounded-full border border-border bg-background-light px-2 py-0.5 text-xs shadow-xs hover:bg-background focus:ring-0 ${className}`}
      >
        <div className="flex items-center space-x-1">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="text-xs text-text-muted">{displayValue || placeholder}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="min-w-32">
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="py-1 text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
