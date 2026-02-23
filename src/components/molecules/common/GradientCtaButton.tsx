'use client';

import { Button } from '@/components/ui/button';
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
        '',
        className
      )}
    >
      <Button
        variant="default"
        className={cx(
          size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-sm',
          'border-transparent',
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
