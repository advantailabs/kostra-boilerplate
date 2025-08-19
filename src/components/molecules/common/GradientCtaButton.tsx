'use client';

import { Button } from '@/components/atom/Button';
import { cx } from '@/lib/utils';

export interface GradientCtaButtonProps {
  label: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string; // wrapper class
  buttonClassName?: string; // extra classes on Button
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function GradientCtaButton({
  label,
  onClick,
  size = 'sm',
  className,
  buttonClassName,
  disabled,
  isLoading,
  loadingText,
}: GradientCtaButtonProps) {
  return (
    <div
      className={cx(
        'rounded-md bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 p-[1px] shadow-[0_0_16px_rgba(99,102,241,0.35)]',
        className
      )}
    >
      <Button
        variant="ghost"
        className={cx(
          size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-sm',
          'border-transparent bg-white text-gray-900 hover:bg-gray-50',
          'dark:bg-gray-900/50 dark:text-gray-100 dark:hover:bg-gray-900/60',
          'btn-shimmer',
          buttonClassName
        )}
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        loadingText={loadingText}
      >
        {label}
      </Button>
    </div>
  );
}

export default GradientCtaButton;
