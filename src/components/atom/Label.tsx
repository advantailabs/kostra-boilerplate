// Tremor Raw Label [v0.0.0]

import * as LabelPrimitives from '@radix-ui/react-label';
import * as React from 'react';

import { cx } from '@/lib/utils';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> {
  disabled?: boolean;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitives.Root>, CheckboxProps>(
  ({ className, disabled, ...props }, forwardedRef) => (
    <LabelPrimitives.Root
      ref={forwardedRef}
      className={cx(
        // base
        'text-sm font-medium leading-none',
        // text color
        'text-text',
        // disabled
        {
          'text-text-muted': disabled,
        },
        className
      )}
      aria-disabled={disabled}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
