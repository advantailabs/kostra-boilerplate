// Tremor Raw Badge [v0.0.0]

import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cx } from '@/lib/utils';

const badgeVariants = tv({
  base: cx(
    'inline-flex items-center gap-x-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ring-1'
  ),
  variants: {
    variant: {
      default: ['ring-indigo-500/30 bg-indigo-50 text-indigo-800'],
      neutral: ['ring-gray-500/30 bg-gray-50 text-gray-700'],
      success: ['ring-emerald-600/30 bg-emerald-50 text-emerald-800'],
      error: ['ring-red-600/20 bg-red-50 text-red-800'],
      warning: ['ring-yellow-600/30 bg-yellow-50 text-yellow-800'],
      info: ['ring-cyan-600/30 bg-cyan-50 text-cyan-800'],
      primary: ['ring-purple-600/30 bg-purple-50 text-purple-800'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps
  extends React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span ref={forwardedRef} className={cx(badgeVariants({ variant }), className)} {...props} />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants, type BadgeProps };
