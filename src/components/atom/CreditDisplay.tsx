'use client';

import { RiCoinLine } from '@remixicon/react';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth';
import { useCreditStore } from '@/store/credits';

interface CreditDisplayProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CreditDisplay({
  className = '',
  showIcon = true,
  size = 'md',
}: CreditDisplayProps) {
  const authUser = useAuthStore(state => state.user);
  const { credits: creditStoreCredits, initialized, setCredits } = useCreditStore();

  // Initialize credits from auth store if not already initialized
  useEffect(() => {
    if (!initialized && authUser?.credits !== undefined) {
      setCredits(authUser.credits);
    }
  }, [authUser?.credits, initialized, setCredits]);

  // Use credit store for real-time updates, fallback to auth store
  const credits = initialized ? creditStoreCredits : authUser?.credits;

  if (credits === undefined) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizeClasses = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <div
      className={`dark:text-muted-foreground flex items-center gap-1.5 text-gray-700 ${className}`}
    >
      {showIcon && (
        <RiCoinLine
          className={`${iconSizeClasses[size]} shrink-0 text-yellow-500`}
          aria-hidden="true"
        />
      )}
      <span className={`font-medium ${sizeClasses[size]}`}>{credits.toFixed(1)}</span>
    </div>
  );
}
