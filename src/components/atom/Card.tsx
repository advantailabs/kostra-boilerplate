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

// Additional card building blocks to match common API usage

interface CardHeaderProps extends React.ComponentPropsWithoutRef<'div'> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div ref={forwardedRef} className={cx('px-4 py-3 sm:px-6 sm:py-4', className)} {...props} />
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.ComponentPropsWithoutRef<'h3'> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      // eslint-disable-next-line jsx-a11y/heading-has-content
      <h3
        ref={forwardedRef}
        className={cx('text-base font-semibold text-gray-900 dark:text-gray-50', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <p
        ref={forwardedRef}
        className={cx('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.ComponentPropsWithoutRef<'div'> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
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
  CardTitle,
  type CardContentProps,
  type CardDescriptionProps,
  type CardHeaderProps,
  type CardTitleProps,
};
