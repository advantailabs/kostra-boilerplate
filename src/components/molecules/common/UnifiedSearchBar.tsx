'use client';

import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface UnifiedSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function UnifiedSearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
}: UnifiedSearchBarProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-x-auto overflow-y-visible">
          {/* Search bar */}
          <div className="h-7 min-w-[200px]">
            <Field>
              <Input
                name='search'
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="bg-background"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
