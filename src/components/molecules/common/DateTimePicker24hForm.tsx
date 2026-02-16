/* eslint-disable */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Calendar } from '@/components/molecules/common/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/molecules/common/Popover';
import { Button } from '@/components/ui/button';
import { cx } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const FormSchema = z.object({
  time: z.date({
    required_error: 'A date and time is required.',
  }),
});

interface DateTimePicker24hFormProps {
  disabled?: boolean;
  value?: Date;
  onChange?: (_date: Date | undefined) => void;
  minDate?: Date; // Minimum date that can be selected (prevents past dates)
}

export function DateTimePicker24hForm({
  disabled = false,
  value,
  onChange,
  minDate,
}: DateTimePicker24hFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Use controlled value if provided, otherwise use form state
  const currentValue = value || form.watch('time');

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (onChange) {
      onChange(data.time);
    } else {
      toast.success(`Selected date and time: ${format(data.time, 'PPPP HH:mm')}`);
    }
  }

  const adjustDateIfNeeded = useCallback(
    (date: Date): Date => {
      if (minDate && date < minDate) {
        return new Date(minDate);
      }
      return date;
    },
    [minDate],
  );

  const updateDateValue = useCallback(
    (date: Date) => {
      const adjustedDate = adjustDateIfNeeded(date);
      if (onChange) {
        onChange(adjustedDate);
      } else {
        form.setValue('time', adjustedDate);
      }
    },
    [adjustDateIfNeeded, onChange, form],
  );

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        updateDateValue(date);
      }
    },
    [updateDateValue],
  );

  const handleTimeChange = useCallback(
    (type: 'hour' | 'minute', value: string) => {
      const currentDate = currentValue || new Date();
      const newDate = new Date(currentDate);

      if (type === 'hour') {
        const hour = parseInt(value, 10);
        newDate.setHours(hour);
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value, 10));
      }

      updateDateValue(newDate);
    },
    [currentValue, updateDateValue],
  );

  const content = (
    <div className="space-y-5">
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter your date & time (24h)
        </label>
        <Popover>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant="secondary"
              disabled={disabled}
              className={cx(
                'w-full pl-3 text-left font-normal',
                !currentValue && 'text-muted-foreground',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {currentValue ? (
                format(currentValue, 'MM/dd/yyyy HH:mm')
              ) : (
                <span>MM/DD/YYYY HH:mm</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-[9999] w-auto p-0">
            <div className="flex max-w-sm">
              <Calendar
                mode="single"
                selected={currentValue}
                onSelect={handleDateSelect}
                initialFocus
                fromDate={minDate}
                disabled={minDate ? { before: minDate } : undefined}
              />
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex h-[250px]">
                {/* Hours Column */}
                <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 w-12 overflow-auto">
                  <div className="flex flex-col space-y-0 p-0">
                    {Array.from({ length: 24 }, (_, i) => i)
                      .reverse()
                      .map(hour => (
                        <Button
                          key={hour}
                          variant={
                            currentValue && currentValue?.getHours() === hour ? 'default' : 'ghost'
                          }
                          className="h-7 w-full text-xs"
                          onClick={() => handleTimeChange('hour', hour.toString())}
                        >
                          {hour}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Vertical divider between hours and minutes */}
                <div className="w-px bg-gray-200 dark:bg-gray-700" />

                {/* Minutes Column */}
                <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 w-12 overflow-auto">
                  <div className="flex flex-col space-y-0 p-0">
                    {Array.from({ length: 4 }, (_, i) => i * 15).map(minute => (
                      <Button
                        key={minute}
                        variant={
                          currentValue && currentValue?.getMinutes() === minute
                            ? 'default'
                            : 'ghost'
                        }
                        className="h-7 w-full text-xs"
                        onClick={() => handleTimeChange('minute', minute.toString())}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please select your preferred date and time.
        </p>
        {!onChange && form.formState.errors.time && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.time?.message}</p>
        )}
      </div>
    </div>
  );

  // If onChange is provided, render without form wrapper (controlled mode)
  if (onChange) {
    return content;
  }

  // Otherwise, render with form wrapper (uncontrolled mode)
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {content}
    </form>
  );
}
