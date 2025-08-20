'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

// Toast function wrapper
const toast = {
  success: (message: string | React.ReactNode, options?: { description?: string }) => {
    sonnerToast.success(message, options);
  },
  error: (message: string | React.ReactNode, options?: { description?: string }) => {
    sonnerToast.error(message, options);
  },
  warning: (message: string | React.ReactNode, options?: { description?: string }) => {
    sonnerToast.warning(message, options);
  },
  info: (message: string | React.ReactNode, options?: { description?: string }) => {
    sonnerToast.info(message, options);
  },
  loading: (message: string | React.ReactNode, options?: { description?: string }) => {
    sonnerToast.loading(message, options);
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
};

// Toast component wrapper
interface ToasterProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  expand?: boolean;
  visibleToasts?: number;
}

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
  ({ position = 'bottom-right', expand = false, visibleToasts = 5, ...props }, _forwardedRef) => {
    const { theme } = useTheme();
    return (
      <SonnerToaster
        className="toaster"
        theme={theme as 'light' | 'dark' | 'system' | undefined}
        position={position}
        expand={expand}
        visibleToasts={visibleToasts}
        closeButton={false}
        toastOptions={{
          classNames: {
            // Base toast container
            toast:
              'toast bg-white text-gray-950 border border-gray-200 shadow-lg select-none dark:!bg-gray-950 dark:!text-gray-50 dark:!border-gray-900',
            description: 'text-gray-600 dark:!text-gray-200 opacity-100 select-none',
            actionButton:
              'bg-gray-900 text-gray-50 hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200',
            cancelButton:
              'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800',
            closeButton:
              'border-gray-200 bg-white text-gray-500 hover:text-gray-900 dark:border-gray-900 dark:bg-gray-950 dark:text-gray-300 dark:hover:text-gray-50',
            // Variants - keep subtle color accents while relying on dark base background
            success:
              'border-emerald-200 text-emerald-900 dark:border-emerald-900 dark:text-emerald-400',
            error: 'border-red-200 text-red-900 dark:border-red-900 dark:text-red-400',
            warning:
              'border-yellow-200 text-yellow-900 dark:border-yellow-900 dark:text-yellow-400',
            info: 'border-blue-200 text-blue-900 dark:border-blue-900 dark:text-blue-400',
            loading: 'border-gray-200 text-gray-900 dark:border-gray-900 dark:text-gray-50',
          },
        }}
        {...props}
      />
    );
  }
);

Toaster.displayName = 'Toaster';

export { toast, Toaster, type ToasterProps };
