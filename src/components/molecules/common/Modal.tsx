import { Button } from '@/components/atom/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { RiCloseLine } from '@remixicon/react';
import { ReactNode } from 'react';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Modal title displayed in the header
   */
  title: string;

  /**
   * Optional description displayed below the title
   */
  description?: string;

  /**
   * Modal content
   */
  children: ReactNode;

  /**
   * Function called when the modal is closed
   */
  onClose: () => void;

  /**
   * Maximum width class for the modal (tailwind class)
   * @default "max-w-md"
   */
  maxWidth?: string;

  /**
   * Footer actions
   */
  footer?: ReactNode;

  /**
   * Primary action button text
   */
  primaryActionText?: string;

  /**
   * Secondary action button text
   */
  secondaryActionText?: string;

  /**
   * Function called when the primary action button is clicked
   */
  onPrimaryAction?: () => void;

  /**
   * Whether the primary action button is disabled
   */
  isPrimaryActionDisabled?: boolean;

  /**
   * Whether the primary action button is loading
   */
  isPrimaryActionLoading?: boolean;

  /**
   * Variant for the primary action button
   */
  primaryActionVariant?: 'primary' | 'secondary' | 'destructive' | 'ghost';

  /**
   * Additional class name for the content wrapper
   */
  contentClassName?: string;

  /**
   * Whether to remove padding from content area
   */
  removePadding?: boolean;
}

export function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  maxWidth = 'max-w-md',
  footer,
  primaryActionText,
  secondaryActionText = 'Cancel',
  onPrimaryAction,
  isPrimaryActionDisabled = false,
  isPrimaryActionLoading = false,
  primaryActionVariant = 'primary',
  contentClassName = '',
  removePadding = false,
}: ModalProps) {
  // Default footer if primaryActionText is provided but no custom footer
  const defaultFooter = (primaryActionText || secondaryActionText) && !footer && (
    <div className="flex items-center justify-end gap-2">
      {secondaryActionText && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isPrimaryActionLoading}
        >
          {secondaryActionText}
        </Button>
      )}
      {primaryActionText && (
        <Button
          type="button"
          variant={primaryActionVariant}
          onClick={onPrimaryAction}
          disabled={isPrimaryActionDisabled}
          isLoading={isPrimaryActionLoading}
          loadingText="Saving..."
        >
          {primaryActionText}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} p-0 ${contentClassName}`}>
        <DialogHeader className="relative border-b border-border p-4 max-sm:p-3">
          <DialogTitle className="text-base max-sm:pr-12">{title}</DialogTitle>
          {description && (
            <DialogDescription className="-mt-1 text-sm max-sm:pr-12">
              {description}
            </DialogDescription>
          )}
          <DialogClose className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:bg-background-light hover:text-text focus:outline-hidden focus:ring-2 focus:ring-primary">
            <RiCloseLine className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className={removePadding ? 'p-0' : 'px-4 pt-4 max-sm:px-3 max-sm:pt-3'}>
          {/* Main content */}
          <div className="mb-4 max-sm:mb-3">{children}</div>

          {/* Footer with action buttons */}
          {(footer || defaultFooter) && (
            <>
              <div className="-mx-4 border-t border-border" />
              <div className="py-4 max-sm:py-3">{footer || defaultFooter}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
