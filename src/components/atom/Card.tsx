// Tremor Raw Card [v0.0.1]

import { Slot } from '@radix-ui/react-slot';
import React from 'react';

import { cx } from '@/lib/utils';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : 'div';
    return (
      <Component
        ref={forwardedRef}
        className={cx(
          // base
          'relative w-full rounded-xl border text-left shadow-sm',
          // background color
          'bg-white dark:bg-gray-900',
          // border color
          'border-gray-200 dark:border-gray-800',
          // transitions
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card, type CardProps };
