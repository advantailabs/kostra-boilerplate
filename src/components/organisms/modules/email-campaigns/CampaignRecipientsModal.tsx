'use client';

import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/atom/Badge';
import { DataTable } from '@/components/ui/data-table';
import { CampaignRecipientWithUserSimple } from '@/types/campaign';

import { Modal } from '@/components/molecules/common/Modal';
import {
  campaignRecipientsTableColumns,
  formatDate,
  formatStatusText,
  getErrorMessage,
  getRecipientStatusBadgeVariant,
} from './campaignRecipientsTableColumns';

interface CampaignRecipientsModalProps {
  isOpen: boolean;

  onClose: () => void;

  campaignId: number | null;

  campaignName: string;

  recipients?: CampaignRecipientWithUserSimple[];
}

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
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={`Campaign Recipients - ${campaignName}`}
        description="View all recipients for this campaign"
        maxWidth="max-w-4xl!"
        contentClassName="max-h-[90vh] overflow-y-auto"
      >

        <div className="">
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
            <div className="relative overflow-hidden overflow-x-auto rounded-md border-gray-200 dark:border-gray-800">
              <DataTable<CampaignRecipientWithUserSimple, unknown>
                columns={campaignRecipientsTableColumns}
                data={recipients}
                meta={{ errorMessages }}
                emptyMessage="No recipients."
                isLoading={isLoading}
                loadingMessage="Loading recipients..."
              />
            </div>
          )}

          {/* Mobile Card Layout */}
          {/* {!isLoading && !error && recipients.length > 0 && (
            <div className="space-y-3 md:hidden">
              {recipients.map(recipient => (
                <MobileRecipientCard
                  key={recipient.id}
                  recipient={recipient}
                  errorMessages={errorMessages}
                />
              ))}
            </div>
          )} */}
        </div>
      </Modal>
    </>
  );
}
