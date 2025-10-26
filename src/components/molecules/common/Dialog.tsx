// Tremor Raw Dialog [v0.0.0]

import * as DialogPrimitives from '@radix-ui/react-dialog';
import React from 'react';

import { cx, focusRing } from '@/lib/utils';

function Dialog(props: React.ComponentPropsWithoutRef<typeof DialogPrimitives.Root>) {
  return <DialogPrimitives.Root {...props} />;
}
Dialog.displayName = 'Dialog';

const DialogTrigger = DialogPrimitives.Trigger;

DialogTrigger.displayName = 'DialogTrigger';

const DialogClose = DialogPrimitives.Close;

DialogClose.displayName = 'DialogClose';

const DialogPortal = DialogPrimitives.Portal;

DialogPortal.displayName = 'DialogPortal';

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DialogPrimitives.Overlay
      ref={forwardedRef}
      className={cx(
        // base
        'fixed inset-0 z-50 overflow-y-auto',
        // background color with blur effect
        'bg-black/70 backdrop-blur-sm',
        // transition
        'data-[state=open]:animate-dialogOverlayShow',
        className
      )}
      {...props}
    />
  );
});

DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitives.Content
          ref={forwardedRef}
          className={cx(
            // base
            'fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-6',
            // embossed effect using layered shadows
            'shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]',
            // light inset shadow on top for embossed effect
            'before:pointer-events-none before:absolute before:inset-0 before:rounded-xl',
            'before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)]',
            // background color - using bg-light for modals/popups
            'bg-background-light',
            // transitions
            'transition-all duration-200',
            // dark mode embossed effect with theme colors
            'dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)]',
            'dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]',
            // transition
            'data-[state=open]:animate-dialogContentShow',
            focusRing,
            className
          )}
          {...props}
        />
      </DialogOverlay>
    </DialogPortal>
  );
});

DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('flex flex-col gap-y-1', className)} {...props} />;
}

DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className, ...props }, forwardedRef) => (
  <DialogPrimitives.Title
    ref={forwardedRef}
    className={cx(
      // base
      'text-lg font-semibold',
      // text color
      'text-text',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DialogPrimitives.Description
      ref={forwardedRef}
      className={cx('text-text-muted', className)}
      {...props}
    />
  );
});

DialogDescription.displayName = 'DialogDescription';

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

DialogFooter.displayName = 'DialogFooter';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
