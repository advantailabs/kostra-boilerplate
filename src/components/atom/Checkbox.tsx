// Tremor Raw Checkbox [v0.0.2]

import * as CheckboxPrimitives from '@radix-ui/react-checkbox';
import React from 'react';

import { cx, focusRing } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, checked, ...props }, forwardedRef) => {
  return (
    <CheckboxPrimitives.Root
      ref={forwardedRef}
      {...props}
      checked={checked}
      className={cx(
        // base
        'relative inline-flex size-4 shrink-0 appearance-none items-center justify-center rounded shadow-xs outline-hidden ring-1 ring-inset transition duration-100 enabled:cursor-pointer',
        // text color
        'text-white',
        // background color
        'bg-background',
        // ring color
        'ring-border',
        // disabled
        'data-[disabled]:bg-background-light data-[disabled]:text-text-muted data-[disabled]:ring-border-muted',
        // checked and enabled
        'enabled:data-[state=checked]:bg-primary enabled:data-[state=checked]:ring-0 enabled:data-[state=checked]:ring-transparent',
        // indeterminate
        'enabled:data-[state=indeterminate]:bg-primary enabled:data-[state=indeterminate]:ring-0 enabled:data-[state=indeterminate]:ring-transparent',
        // focus
        focusRing,
        className
      )}
    >
      <CheckboxPrimitives.Indicator asChild className="flex size-full items-center justify-center">
        {checked === 'indeterminate' ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              x1="4"
              x2="12"
              y1="8"
              y2="8"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2 5.59998L6.79999 9.99998L4.79999 7.99998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
