// Tremor Raw Button [v0.1.1]

import { Slot } from '@radix-ui/react-slot';
import { RiLoader2Fill } from '@remixicon/react';
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cx, focusRing } from '@/lib/utils';

const buttonVariants = tv({
  base: [
    // base
    'relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium transition-all duration-200 ease-in-out',
    // shadow - using shadow-xs for buttons
    'shadow-xs',
    // disabled
    'disabled:pointer-events-none disabled:shadow-none',
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        'border-transparent',
        // text color
        'text-white',
        // background color - using primary color
        'bg-primary',
        // hover effects
        'hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md',
        // disabled
        'disabled:bg-gray-100 disabled:text-gray-400',
        'disabled:dark:bg-gray-800 disabled:dark:text-gray-600',
      ],
      secondary: [
        // border
        'border-border',
        // text color
        'text-text',
        // background color - using bg-light for secondary buttons
        'bg-background-light',
        // hover effects
        'hover:-translate-y-0.5 hover:bg-background hover:shadow-md',
        // disabled
        'disabled:text-text-muted',
      ],
      light: [
        // base
        'shadow-none',
        // border
        'border-transparent',
        // text color
        'text-text',
        // background color
        'bg-background-dark',
        // hover color
        'hover:bg-background',
        // disabled
        'disabled:bg-background-light disabled:text-text-muted',
      ],
      ghost: [
        // base
        'shadow-none',
        // border
        'border-transparent',
        // text color
        'text-text',
        // hover color
        'bg-transparent hover:bg-background-light',
        // disabled
        'disabled:text-text-muted',
      ],
      destructive: [
        // text color
        'text-white',
        // border
        'border-transparent',
        // background color
        'bg-danger',
        // hover effects
        'hover:-translate-y-0.5 hover:bg-danger-hover hover:shadow-md',
        // disabled
        'disabled:bg-gray-300 disabled:text-white',
        'disabled:dark:bg-gray-800 disabled:dark:text-gray-400',
      ],
      elevated: [
        // border
        'border-border',
        // text color
        'text-text-muted',
        // background color
        'bg-background',
        // hover effects
        'hover:-translate-y-0.5 hover:bg-background-light hover:text-text hover:shadow-md',
        // disabled
        'disabled:bg-background-light disabled:text-text-muted',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin text-gray-600 dark:text-gray-300"
              aria-hidden="true"
            />
            <span className="sr-only">{loadingText || 'Loading'}</span>
            {loadingText || children}
          </span>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };
