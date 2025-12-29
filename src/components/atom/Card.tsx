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
          'relative w-full rounded-xl text-left',
          // embossed effect using layered shadows
          'shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]',
          // light inset shadow on top for embossed effect
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-xl',
          'before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)]',
          // background color - using bg-light for cards (elevated elements)
          'bg-background-light',
          // transitions
          'transition-all duration-200',
          // dark mode embossed effect with theme colors
          'dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)]',
          'dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card, type CardProps };

// Additional card building blocks to match common API usage

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div ref={forwardedRef} className={cx('px-4 py-3 sm:px-6 sm:py-4', className)} {...props} />
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h3'>>(
  ({ className, ...props }, forwardedRef) => {
    return (

      <h3
        ref={forwardedRef}
        className={cx('text-base font-semibold text-text', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';


const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <p ref={forwardedRef} className={cx('mt-1 text-sm text-text-muted', className)} {...props} />
    );
  }
);

CardDescription.displayName = 'CardDescription';


const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cx('px-4 pb-4 pt-0 sm:px-6 sm:pb-6', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

export {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
};

