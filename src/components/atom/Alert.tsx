import React from 'react';

import { cx } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cx(
          'relative w-full rounded-md border p-3 text-sm',
          'border-gray-200 bg-gray-50 text-gray-700',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300',
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

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cx('text-sm', className)} {...props}>
        {children}
      </p>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';
