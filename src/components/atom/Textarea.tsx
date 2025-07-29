// Tremor Raw Textarea [v1.0.3]

import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cx, focusInput, hasErrorInput } from '@/lib/utils';

const textareaStyles = tv({
  base: [
    // base
    'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm',
    // border color
    'border-gray-300 dark:border-gray-800',
    // text color
    'text-gray-900 dark:text-gray-50',
    // placeholder color
    'placeholder-gray-400 dark:placeholder-gray-500',
    // background color
    'bg-white dark:bg-gray-950',
    // disabled
    'disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
    'disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500',
    // focus
    focusInput,
    // resize
    'resize-vertical',
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
  },
});

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaStyles> {
  textareaClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaClassName, hasError, ...props }: TextareaProps, forwardedRef) => {
    return (
      <div className={cx('relative w-full', className)}>
        <textarea
          ref={forwardedRef}
          className={cx(textareaStyles({ hasError }), textareaClassName)}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaStyles, type TextareaProps };
