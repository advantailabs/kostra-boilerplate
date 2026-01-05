import React from 'react';

import { cx } from '@/lib/utils';


export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cx(
          'relative w-full rounded-md border p-3 text-sm',
          'border-border bg-background-light text-text',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';


export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cx('text-sm', className)} {...props}>
        {children}
      </p>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';
