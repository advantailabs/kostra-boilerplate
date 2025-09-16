'use client';

import { Input } from '@/components/atom/Input';

interface UnifiedSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function UnifiedSearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  inputClassName = '',
}: UnifiedSearchBarProps) {
  return (
    <div className={`flex flex-col gap-2 pb-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-x-auto overflow-y-visible">
          {/* Search bar */}
          <div className="h-8 min-w-[200px]">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-full"
              inputClassName={`h-full py-0 ${inputClassName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
