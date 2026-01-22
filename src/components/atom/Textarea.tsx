// Tremor Raw Textarea [v1.0.3]

import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cx, focusInput, hasErrorInput } from '@/lib/utils';

const textareaStyles = tv({
  base: [
    // base
    'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm',
    // border color
    'border-border',
    // text color
    'text-text',
    // placeholder color
    'placeholder-text-muted',
    // background color - using bg-light for textareas (same as inputs)
    'bg-background-light',
    // disabled
    'disabled:border-border-muted disabled:bg-background-light disabled:text-text-muted',
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
