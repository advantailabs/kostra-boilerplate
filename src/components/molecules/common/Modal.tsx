import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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

  /**
   * When true, modal uses full-screen layout and content area fills remaining height.
   */
  fullScreen?: boolean;
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
  fullScreen = false,
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
          variant={primaryActionVariant === 'primary' ? 'default' : primaryActionVariant}
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

  const isInsideCombobox = (event: Event & { detail?: { originalEvent?: Event } }) => {
    const target =
      (event.target as HTMLElement) ??
      (event.detail?.originalEvent?.target as HTMLElement);
    return Boolean(
      target?.closest?.('[data-slot="combobox-content"], [data-slot="combobox-list"]')
    );
  };

  const handlePointerDownOutside = (event: Event) => {
    if (isInsideCombobox(event)) {
      event.preventDefault();
    }
  };

  const handleInteractOutside = (event: Event) => {
    if (isInsideCombobox(event)) {
      event.preventDefault();
    }
  };

  const contentWrapperClassName = fullScreen
    ? removePadding
      ? 'flex min-h-0 flex-1 flex-col p-0'
      : 'flex min-h-0 flex-1 flex-col px-4 py-4 max-sm:px-3 max-sm:py-3'
    : removePadding
      ? 'p-0'
      : 'px-4 py-4 max-sm:px-3 max-sm:py-3';

  const innerContentClassName = fullScreen ? 'flex min-h-0 flex-1 flex-col' : '';

  const dialogContentClassName = fullScreen
    ? `fixed inset-0 z-[1000] flex h-screen w-screen max-h-none max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 border-border bg-background p-0 shadow-2xl sm:max-w-none gap-0 ${contentClassName}`.trim()
    : `${maxWidth} gap-0 p-0 ${contentClassName}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={dialogContentClassName}
        onPointerDownOutside={handlePointerDownOutside}
        onInteractOutside={handleInteractOutside}
      >
        <DialogHeader className="relative border-b border-border p-4 max-sm:p-3">
          <DialogTitle className=" max-sm:pr-12">{title}</DialogTitle>
          {description && (
            <DialogDescription className="-mt-1 max-sm:pr-12">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={contentWrapperClassName}>
          {/* Main content */}
          <div className={innerContentClassName}>{children}</div>

        </div>
        {/* Footer with action buttons */}
        {(footer || defaultFooter) && (
          <>
            <div className="border-t border-border" />
            <DialogFooter className='px-4 py-4 max-sm:px-3 max-sm:py-3'>
              {footer || defaultFooter}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
