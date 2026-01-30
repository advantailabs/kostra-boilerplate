'use client';

import { useCallback, useEffect, useState } from 'react';

import { CampaignRecipientWithUserSimple } from '@/types/campaign';
import { RiCloseLine } from '@remixicon/react';
import { Badge, BadgeProps } from '../../../atom/Badge';
import { Button } from '../../../atom/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../molecules/common/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../../molecules/common/Table';

interface CampaignRecipientsModalProps {
  isOpen: boolean;

  onClose: () => void;

  campaignId: number | null;

  campaignName: string;

  recipients?: CampaignRecipientWithUserSimple[];
}

// Helper function to map recipient status to badge variant
const getRecipientStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'SENT':
      return 'success';
    case 'OPENED':
      return 'success';
    case 'CLICKED':
      return 'success';
    case 'FAILED':
      return 'error';
    case 'PENDING':
      return 'warning';
    default:
      return 'default';
  }
};

// Helper function to format status text
const formatStatusText = (status: string): string => {
  switch (status) {
    case 'SENT':
      return 'Sent';
    case 'OPENED':
      return 'Opened';
    case 'CLICKED':
      return 'Clicked';
    case 'FAILED':
      return 'Failed';
    case 'PENDING':
      return 'Pending';
    default:
      return status;
  }
};

// Helper function to format date
const formatDate = (date: Date | string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function to get error message for failed recipients
const getErrorMessage = (
  recipient: CampaignRecipientWithUserSimple,
  errorMessages?: Record<number, string>,
): string => {
  // If there's a specific error message from API, use it (this contains the driver-specific error)
  if (errorMessages && errorMessages[recipient.id]) {
    return errorMessages[recipient.id];
  }

  // If there's an error message stored in the database, use it
  if (recipient.errorMessage) {
    return recipient.errorMessage;
  }

  // Check for common email validation issues
  if (!recipient.user.email.includes('@')) {
    return 'Invalid email address format.';
  }

  // Check for common domain issues
  if (recipient.user.email.endsWith('.test') || recipient.user.email.endsWith('.example')) {
    return 'Cannot send emails to test or example domains.';
  }

  // Default error message
  return "Email delivery failed. Please check the recipient's email address and try again.";
};

// Component for mobile recipient card
interface MobileRecipientCardProps {
  recipient: CampaignRecipientWithUserSimple;
  errorMessages?: Record<number, string>;
}

function MobileRecipientCard({ recipient, errorMessages }: MobileRecipientCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {recipient.user.name}
          </h3>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {recipient.user.email}
          </p>
        </div>
        <div className="ml-2">
          <Badge variant={getRecipientStatusBadgeVariant(recipient.status)}>
            {formatStatusText(recipient.status)}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Sent:</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {formatDate(recipient.sentAt)}
          </span>
        </div>

        {recipient.openedAt && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Opened:</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatDate(recipient.openedAt)}
            </span>
          </div>
        )}

        {recipient.clickedAt && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Clicked:</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatDate(recipient.clickedAt)}
            </span>
          </div>
        )}

        {recipient.status === 'FAILED' && (
          <div className="mt-2 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
            <p className="text-xs text-red-800 dark:text-red-200">
              <strong>Error:</strong> {getErrorMessage(recipient, errorMessages)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for individual table row
interface RecipientRowProps {
  recipient: CampaignRecipientWithUserSimple;
  errorMessages?: Record<number, string>;
}

function RecipientRow({ recipient, errorMessages }: RecipientRowProps) {
  return (
    <TableRow className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900">
      <TableCell className="py-2">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          {recipient.user.name}
        </p>
      </TableCell>
      <TableCell className="py-2">
        <p className="truncate text-sm text-gray-600 dark:text-gray-400">{recipient.user.email}</p>
      </TableCell>
      <TableCell className="py-2">
        <Badge variant={getRecipientStatusBadgeVariant(recipient.status)}>
          {formatStatusText(recipient.status)}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        {recipient.status === 'FAILED' && (
          <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
            <p className="text-xs text-red-800 dark:text-red-200">
              <strong>Error:</strong> {getErrorMessage(recipient, errorMessages)}
            </p>
          </div>
        )}
        {recipient.status === 'SENT' && (
          <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>Sent:</strong> {formatDate(recipient.sentAt)}
            </p>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function CampaignRecipientsModal({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  recipients: initialRecipients,
}: CampaignRecipientsModalProps) {
  const [recipients, setRecipients] = useState<CampaignRecipientWithUserSimple[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<Record<number, string>>({});

  const fetchErrorMessages = useCallback(
    async (recipientsData: CampaignRecipientWithUserSimple[]) => {
      const failedRecipients = recipientsData.filter(r => r.status === 'FAILED');

      if (failedRecipients.length === 0 || !campaignId) return;

      try {
        // Fetch error messages from the API endpoint
        const response = await fetch(`/api/campaigns/${campaignId}/recipients/errors`);

        if (response.ok) {
          const data = await response.json();
          const apiErrorMessages = data.data?.errorMessages || {};

          // Merge API error messages with fallback messages
          const errorMessagesMap: Record<number, string> = {};

          for (const recipient of failedRecipients) {
            // Use API error message if available, otherwise use fallback
            errorMessagesMap[recipient.id] =
              apiErrorMessages[recipient.id] || getErrorMessage(recipient);
          }

          setErrorMessages(errorMessagesMap);
        } else {
          // Fallback to local error messages if API fails
          const errorMessagesMap: Record<number, string> = {};

          for (const recipient of failedRecipients) {
            errorMessagesMap[recipient.id] = getErrorMessage(recipient);
          }

          setErrorMessages(errorMessagesMap);
        }
      } catch (err) {
        console.error('Error fetching error messages:', err);

        // Fallback to local error messages
        const errorMessagesMap: Record<number, string> = {};

        for (const recipient of failedRecipients) {
          errorMessagesMap[recipient.id] = getErrorMessage(recipient);
        }

        setErrorMessages(errorMessagesMap);
      }
    },
    [campaignId],
  );

  const fetchRecipients = useCallback(async () => {
    if (!campaignId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/recipients`);

      if (!response.ok) {
        throw new Error('Failed to fetch recipients');
      }

      const data = await response.json();
      const recipientsData = data.data.campaignRecipients || [];
      setRecipients(recipientsData);

      // Fetch error messages for failed recipients
      await fetchErrorMessages(recipientsData);
    } catch (err) {
      console.error('Error fetching campaign recipients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipients');
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, fetchErrorMessages]);

  // Fetch recipients when modal opens and campaignId is available
  useEffect(() => {
    if (isOpen && campaignId && !initialRecipients) {
      fetchRecipients();
    } else if (initialRecipients) {
      setRecipients(initialRecipients);
    }
  }, [isOpen, campaignId, initialRecipients, fetchRecipients]);

  const handleClose = () => {
    setRecipients([]);
    setError(null);
    setErrorMessages({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="relative border-b border-gray-200 p-4 max-sm:p-3 dark:border-gray-700">
          <DialogTitle className="text-base">{`Campaign Recipients - ${campaignName}`}</DialogTitle>
          <DialogDescription className="-mt-1 text-sm">
            View all recipients for this campaign
          </DialogDescription>
          <DialogClose className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:ring-gray-700">
            <RiCloseLine className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-3 max-sm:p-2">
          {/* Statistics */}

          {/* Error state */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex h-32 items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <span className="text-sm text-gray-500">Loading recipients...</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && recipients.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">No recipients found for this campaign.</p>
            </div>
          )}

          {/* Desktop Table */}
          {!isLoading && !error && recipients.length > 0 && (
            <div className="relative hidden overflow-hidden overflow-x-auto rounded-lg border border-gray-200 md:block dark:border-gray-800">
              <Table className="min-w-full border-0">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="py-2">Name</TableHeaderCell>
                    <TableHeaderCell className="py-2">Email</TableHeaderCell>
                    <TableHeaderCell className="py-2">Status</TableHeaderCell>
                    <TableHeaderCell className="py-2" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipients.map(recipient => (
                    <RecipientRow
                      key={recipient.id}
                      recipient={recipient}
                      errorMessages={errorMessages}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Card Layout */}
          {!isLoading && !error && recipients.length > 0 && (
            <div className="space-y-3 md:hidden">
              {recipients.map(recipient => (
                <MobileRecipientCard
                  key={recipient.id}
                  recipient={recipient}
                  errorMessages={errorMessages}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Cancel button */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-end gap-2 p-3 max-sm:p-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
