'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { UserSelectionModal } from '@/components/molecules/common/UserSelectionModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CampaignStatus } from '@/lib/prisma/generated/browser';
import { CampaignFormData, type EmailCampaignEditorModalProps } from '@/types/campaign';
import { UserSelection } from '@/types/user';
import { useAdminUsers } from '../../../../hooks/useAdminUsers';
import { useEmailCampaigns } from '../../../../hooks/useEmailCampaigns';
import { useEmailTemplates } from '../../../../hooks/useEmailTemplates';
import { Label } from '../../../atom/Label';
import { DateTimePicker24hForm } from '../../../molecules/common/DateTimePicker24hForm';
import { Modal } from '../../../molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../molecules/common/Select';

// Validation schema
const campaignSchema = z
  .object({
    name: z.string().min(1, 'Campaign name is required'),
    description: z.string().optional(),
    emailTemplateId: z.number().min(1, 'Email template is required').or(z.undefined()),
    recipients: z.array(z.number()).min(1, 'At least one recipient is required'),
    sendOption: z.enum(['immediately', 'scheduled']),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    status: z.enum(['SCHEDULED', 'SENT', 'FAILED', 'PARTIALLYSUCCESS']).optional(),
  })
  .refine(
    data => {
      if (data.sendOption === 'scheduled') {
        return (
          data.scheduledDate &&
          data.scheduledDate.trim() !== '' &&
          data.scheduledTime &&
          data.scheduledTime.trim() !== ''
        );
      }
      return true;
    },
    {
      message: 'Scheduled date and time are required when scheduling for later',
      path: ['scheduledDate'],
    },
  );

export function EmailCampaignEditorModal(props: EmailCampaignEditorModalProps) {
  const { isOpen, onClose, onSuccess, campaign, mode } = props;
  const { emailTemplates } = useEmailTemplates();
  const { createCampaign, updateCampaign, isCreating, isUpdating } = useEmailCampaigns();

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
    trigger,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      emailTemplateId: undefined,
      recipients: [],
      sendOption: 'immediately',
      scheduledDate: '',
      scheduledTime: '',
      status: undefined,
    },
  });

  // Local state
  const [selectedRecipients, setSelectedRecipients] = useState<UserSelection[]>([]);
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | undefined>();
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Get all users for the selection modal (excluding deleted users)
  const { users: allUsers, isLoading: isLoadingUsers } = useAdminUsers({
    search: '',
    includeDeleted: true,
  });

  // Calculate next 5-minute interval from given time
  const getNext5MinuteInterval = useCallback((fromTime: Date) => {
    const scheduledTime = new Date(fromTime);

    // Get current minutes
    const currentMinutes = fromTime.getMinutes();

    // Calculate next 5-minute interval
    const nextInterval = Math.ceil((currentMinutes + 1) / 5) * 5;

    if (nextInterval >= 60) {
      // If next interval is 60 or more, move to next hour
      scheduledTime.setHours(fromTime.getHours() + 1);
      scheduledTime.setMinutes(0, 0, 0);
    } else {
      // Set to next 5-minute interval
      scheduledTime.setMinutes(nextInterval, 0, 0);
    }

    return scheduledTime;
  }, []);

  // Calculate immediate send time (next 5-minute interval from now) - inlined via getNext5MinuteInterval

  // Handle date/time changes based on send option
  useEffect(() => {
    // Only run this effect after form has been initialized
    if (!isFormInitialized) return;
    // Only clear the immediate time if switching to scheduled
    // Don't clear the date/time fields if they already have values (edit mode)
    const currentScheduledDate = watch('scheduledDate');
    const currentScheduledTime = watch('scheduledTime');

    if (!currentScheduledDate || !currentScheduledTime) {
      setScheduledDateTime(undefined);
      setValue('scheduledDate', '');
      setValue('scheduledTime', '');
    }

  }, [setValue, clearErrors, getNext5MinuteInterval, watch, isFormInitialized]);

  // Handle date/time selection from DateTimePicker24hForm
  const handleDateTimeChange = (date: Date | undefined) => {

    setScheduledDateTime(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);
      setValue('scheduledDate', dateStr);
      setValue('scheduledTime', timeStr);
      clearErrors('scheduledDate');
      clearErrors('scheduledTime');
    } else {
      setValue('scheduledDate', '');
      setValue('scheduledTime', '');
    }
  };

  // Initialize form data
  useEffect(() => {
    if (campaign && mode === 'edit') {
      const scheduledDate = campaign.scheduledAt ? new Date(campaign.scheduledAt) : null;
      // If campaign status is FAILED, auto-set status to SCHEDULED
      const initialStatus =
        campaign.status === 'FAILED' ? 'SCHEDULED' : (campaign.status as CampaignStatus);
      reset({
        name: campaign.name,
        description: campaign.description || '',
        emailTemplateId: campaign.emailTemplateId,
        recipients: campaign.recipients.map(r => r.userId),
        sendOption: campaign.scheduledAt ? 'scheduled' : 'immediately',
        scheduledDate: scheduledDate ? scheduledDate.toISOString().split('T')[0] : '',
        scheduledTime: scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : '',
        status: initialStatus,
      });

      // Set selected recipients
      setSelectedRecipients(
        campaign.recipients.map(r => ({
          id: r.userId,
          name: r.user.name,
          email: r.user.email,
          profilePicture: undefined,
          role: 'user',
        })),
      );

      // Set scheduled date/time
      setScheduledDateTime(scheduledDate || undefined);
      setIsFormInitialized(true);
    } else {
      reset({
        name: '',
        description: '',
        emailTemplateId: undefined,
        recipients: [],
        sendOption: 'immediately',
        scheduledDate: '',
        scheduledTime: '',
        status: undefined,
      });
      setSelectedRecipients([]);
      setScheduledDateTime(undefined);
      setIsFormInitialized(true);
    }
  }, [campaign, mode, reset]);

  // Reset form state when modal is closed and reopened
  useEffect(() => {
    if (!isOpen) {
      // Reset all form state when modal is closed
      setSelectedRecipients([]);
      setScheduledDateTime(undefined);
      setIsFormInitialized(false);
      reset({
        name: '',
        description: '',
        emailTemplateId: undefined,
        recipients: [],
        sendOption: 'immediately',
        scheduledDate: '',
        scheduledTime: '',
        status: undefined,
      });
    }
  }, [isOpen, reset]);

  // Handle user selection from modal
  const handleUserSelection = (selectedUsers: UserSelection[]) => {
    setSelectedRecipients(selectedUsers);
    setValue(
      'recipients',
      selectedUsers.map(r => r.id),
    );
    setShowUserSelectionModal(false);
    clearErrors('recipients');
  };

  // Handle form submission
  const onSubmit = async (data: CampaignFormData) => {
    try {
      // Validate required fields
      if (!data.emailTemplateId) {
        throw new Error('Email template is required');
      }

      // Calculate scheduled time based on send option
      let scheduledAt: string | undefined;
      let status: 'SCHEDULED' | 'SENT' | 'FAILED' | 'PARTIALLYSUCCESS';

      if (data.sendOption === 'immediately') {
        // Schedule for next 5-minute interval
        const scheduledTime = getNext5MinuteInterval(new Date());
        scheduledAt = scheduledTime.toISOString();
        status = 'SCHEDULED';
      } else if (data.sendOption === 'scheduled' && data.scheduledDate && data.scheduledTime) {
        scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
        status = 'SCHEDULED';
      } else {
        status = 'SCHEDULED';
      }

      const campaignData = {
        name: data.name,
        description: data.description,
        emailTemplateId: data.emailTemplateId,
        recipients: data.recipients,
        status: data.status || status,
        scheduledAt,
      };

      if (mode === 'create') {
        await createCampaign(campaignData);
      } else if (campaign) {
        await updateCampaign({ id: campaign.id, data: campaignData });
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save campaign: ${error.message}`);
      }
      throw new Error('Failed to save campaign');
    }
  };

  const isLoading = isCreating || isUpdating;

  const modalTitle = mode === 'create' ? 'New Email Campaign' : 'Edit Email Campaign';
  const modalDescription =
    mode === 'create' ? 'Create a new email marketing campaign' : 'Update the campaign details';

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        type="button"
        disabled={isLoading}
        onClick={async () => {
          // Trigger form validation first
          const isValid = await trigger();

          if (isValid) {
            try {
              await handleSubmit(onSubmit)();
            } catch (_error) {
              // Error handling is done in onSubmit
            }
          }
        }}
      >
        {(() => {
          if (isLoading && mode === 'create') return 'Creating Campaign...';
          if (isLoading && mode === 'edit') return 'Updating Campaign...';
          return mode === 'create' ? 'Create Campaign' : 'Update Campaign';
        })()}
      </Button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={modalTitle}
        description={modalDescription}
        maxWidth="max-w-6xl!"
        footer={modalFooter}
        removePadding
        contentClassName="overflow-hidden mb-4 max-sm:mb-3"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 min-h-0 flex-1 flex-col">
          <div className="max-h-[60vh] max-w-full flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-4 py-0 sm:max-h-none sm:space-y-6 sm:px-4 min-[660px]:max-h-[70vh]">
            <div className="grid h-full grid-cols-1 gap-4 sm:gap-6 lg:min-w-0 lg:grid-cols-2 lg:gap-8 ">
              {/* Left Column - Campaign Details */}
              <div className="min-w-0 space-y-4 overflow-hidden sm:space-y-6 lg:space-y-8 lg:border-r lg:border-gray-300 lg:pr-6 dark:lg:border-gray-700">
                {/* Campaign Details Section */}
                <div className="mt-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Campaign Details
                  </h3>

                  <div className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor="name">
                        Campaign Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="name"
                        {...register('name', {
                          onChange: () => clearErrors('name'),
                        })}
                        placeholder="Enter campaign name"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      <FieldError errors={errors.name ? [{ message: errors.name.message }] : []} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Brief description of your campaign"
                        rows={14}
                        className="h-40 max-h-40"
                      />
                    </Field>

                    <Field className="pb-4 sm:pb-6 lg:pb-8">
                      <FieldLabel htmlFor="emailTemplateId">
                        Template <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Combobox
                        id="emailTemplateId"
                        items={emailTemplates ?? []}
                        value={
                          emailTemplates?.find(t => t.id === watch('emailTemplateId')) ?? null
                        }
                        onValueChange={template => {
                          setValue('emailTemplateId', template?.id);
                          clearErrors('emailTemplateId');
                        }}
                        itemToStringLabel={template => template.name}
                        isItemEqualToValue={(a, b) => a?.id === b?.id}
                        itemToStringValue={template => template.name}
                      >
                        <ComboboxInput
                          id="emailTemplateId"
                          placeholder="Select a template"
                          className={`w-full min-w-0 ${errors.emailTemplateId ? 'border-red-500' : ''}`}
                        />
                        <ComboboxContent className="pointer-events-auto">
                          <ComboboxEmpty>No templates found.</ComboboxEmpty>
                          <ComboboxList>
                            {template => (
                              <ComboboxItem key={template.id} value={template}>
                                {template.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FieldError errors={errors.emailTemplateId ? [{ message: errors.emailTemplateId.message }] : []} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Right Column - Recipients and Send Options */}
              <div className="mt-2 min-w-0 space-y-4 overflow-hidden sm:space-y-6 lg:space-y-8">
                {/* Recipients Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recipients <span className="text-red-500">*</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Badge className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Recipients: {selectedRecipients.length}
                      </Badge>
                      <Button
                        type="button"
                        onClick={() => setShowUserSelectionModal(true)}
                        variant="link"
                      >
                        Select Users
                      </Button>
                    </div>

                    {errors.recipients && (
                      <p className="text-sm text-red-500">{errors.recipients.message}</p>
                    )}
                  </div>
                </div>

                {/* Send Options Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Sending Schedule
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose when to send your campaign
                    </p>
                  </div>

                  <div className="mb-4">
                    <DateTimePicker24hForm
                      value={scheduledDateTime}
                      onChange={handleDateTimeChange}
                      minDate={
                        // If editing a failed campaign, prevent selecting past dates/times
                        mode === 'edit' && campaign?.status === 'FAILED'
                          ? getNext5MinuteInterval(new Date())
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Campaign Status Section - Show in edit mode or when a scheduled time is set */}
                {((mode === 'edit' && campaign) || scheduledDateTime) && (
                  <div className="mt-0.5 space-y-0.5 pt-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Campaign Status
                    </h3>

                    <div className="space-y-4 pb-3">
                      {/* Current Status Display */}
                      <div className="flex flex-col space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mode === 'edit' && campaign?.status === 'SENT'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}
                          >
                            {mode === 'edit' && campaign?.status === 'SENT' ? 'Sent' : 'Scheduled'}
                          </span>
                          {((mode === 'edit' && (campaign?.scheduledAt || scheduledDateTime)) ||
                            (mode === 'create' && scheduledDateTime)) && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {mode === 'edit' && campaign?.status === 'SENT'
                                  ? 'Sent at: '
                                  : 'Scheduled for: '}
                                {mode === 'edit' && campaign?.scheduledAt && !scheduledDateTime
                                  ? new Date(campaign.scheduledAt).toLocaleString()
                                  : scheduledDateTime?.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Status Update - Only show for failed campaigns in edit mode */}
                      {mode === 'edit' && campaign && campaign.status === 'FAILED' && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="status"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Update Status
                          </Label>
                          <Select
                            value={watch('status') || ''}
                            onValueChange={value => {
                              setValue(
                                'status',
                                value as 'SCHEDULED' | 'SENT' | 'FAILED' | 'PARTIALLYSUCCESS',
                              );
                              clearErrors('status');
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit button inside form */}
        </form>
      </Modal>
      {/* User Selection Modal - Moved outside the form to prevent event conflicts */}
      <UserSelectionModal
        isOpen={showUserSelectionModal}
        onClose={() => setShowUserSelectionModal(false)}
        onConfirm={handleUserSelection}
        allUsers={allUsers || []}
        key={showUserSelectionModal ? selectedRecipients.map(item => item.id).toString() : ''}
        selectedUsers={selectedRecipients}
        isLoading={isLoadingUsers}
      />
    </>
  );
}
