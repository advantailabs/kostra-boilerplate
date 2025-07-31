import { Button } from '@/components/atom/Button';
import { Dialog, DialogContent, DialogHeader } from '@/components/molecules/common/Dialog';
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
   * Additional class name for the content wrapper
   */
  contentClassName?: string;
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
  contentClassName = '',
}: ModalProps) {
  // Default footer if primaryActionText is provided but no custom footer
  const defaultFooter = (primaryActionText || secondaryActionText) && !footer && (
    <div className="flex items-center justify-end gap-2">
      {secondaryActionText && (
        <Button variant="secondary" onClick={onClose} disabled={isPrimaryActionLoading}>
          {secondaryActionText}
        </Button>
      )}
      {primaryActionText && (
        <Button
          onClick={onPrimaryAction}
          disabled={isPrimaryActionDisabled || isPrimaryActionLoading}
        >
          {isPrimaryActionLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Loading...
            </>
          ) : (
            primaryActionText
          )}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} p-0 ${contentClassName}`}>
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h1>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </DialogHeader>

        <div className="px-4 pt-4">
          {/* Main content */}
          {children}

          {/* Footer with action buttons */}
          {(footer || defaultFooter) && (
            <>
              <div className="-mx-4 border-t border-gray-200 dark:border-gray-700" />
              <div className="py-4">{footer || defaultFooter}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
