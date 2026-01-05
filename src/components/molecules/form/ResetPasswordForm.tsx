'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeSlashIcon } from '@/components/icons/EyeSlashIcon';
import { useResendOTP } from '@/hooks/useResendOTP';
import { useResetPassword } from '@/hooks/useResetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    otp0: z.string().length(1, 'Required'),
    otp1: z.string().length(1, 'Required'),
    otp2: z.string().length(1, 'Required'),
    otp3: z.string().length(1, 'Required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
  onBackToSignIn: () => void;
}

export function ResetPasswordForm({ email, onSuccess, onBackToSignIn }: ResetPasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isLoading: isResetting } = useResetPassword();
  const { resendOTP, isLoading: isResending } = useResendOTP();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp0: '',
      otp1: '',
      otp2: '',
      otp3: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleOTPChange = useCallback(
    (index: number, value: string, e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits
      const digit = value.replace(/\D/g, '');

      // Update the form value
      form.setValue(`otp${index}` as keyof ResetPasswordFormData, digit);

      // Move to next input if value is entered
      if (digit && index < 3) {
        // Find the next input using DOM traversal
        const currentInput = e.target;
        const container = currentInput.closest('.flex');
        const nextInput = container?.children[index + 1]?.querySelector(
          'input'
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    },
    [form]
  );

  const handleOTPKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentInput = e.currentTarget;
      const container = currentInput.closest('.flex');

      // Handle backspace
      if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
        const prevInput = container?.children[index - 1]?.querySelector(
          'input'
        ) as HTMLInputElement;
        prevInput?.focus();
      }

      // Handle arrow keys
      if (e.key === 'ArrowLeft' && index > 0) {
        const prevInput = container?.children[index - 1]?.querySelector(
          'input'
        ) as HTMLInputElement;
        prevInput?.focus();
      }
      if (e.key === 'ArrowRight' && index < 3) {
        const nextInput = container?.children[index + 1]?.querySelector(
          'input'
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    },
    []
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const otpDigits = pastedText.replace(/\D/g, '').slice(0, 4);

      if (otpDigits.length === 4) {
        otpDigits.split('').forEach((digit, i) => {
          form.setValue(`otp${i}` as keyof ResetPasswordFormData, digit);
        });
        // Focus on the last input
        const currentInput = e.target as HTMLInputElement;
        const container = currentInput.closest('.flex');
        const lastInput = container?.children[3]?.querySelector('input') as HTMLInputElement;
        lastInput?.focus();
      }
    },
    [form]
  );

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const otp = `${data.otp0}${data.otp1}${data.otp2}${data.otp3}`;
      await resetPassword({
        email,
        newPassword: data.newPassword,
        otp,
      });
      onSuccess();
    } catch (_error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Verification Code Section */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-400">Verification Code</Label>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(index => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              inputClassName="h-12 w-12 text-center text-lg font-semibold rounded-lg border-border bg-background text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...form.register(`otp${index}` as keyof ResetPasswordFormData, {
                onChange: e => handleOTPChange(index, e.target.value, e),
              })}
              onKeyDown={e => handleOTPKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">Enter the 4-digit code sent to your email.</p>
        {(form.formState.errors.otp0 ||
          form.formState.errors.otp1 ||
          form.formState.errors.otp2 ||
          form.formState.errors.otp3) && (
            <span className="text-sm text-danger">Please enter all 4 digits</span>
          )}
      </div>

      {/* New Password Field */}
      <div>
        <Label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-400">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            {...form.register('newPassword')}
            inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 pr-12 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 flex h-5 w-5 min-w-0 -translate-y-1/2 items-center justify-center rounded-md border-0 p-0 text-gray-500 shadow-none hover:bg-background-light hover:text-gray-400"
          >
            {showNewPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.newPassword && (
          <span className="text-sm text-danger">{form.formState.errors.newPassword.message}</span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-400">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            {...form.register('confirmPassword')}
            inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 pr-12 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 flex h-5 w-5 min-w-0 -translate-y-1/2 items-center justify-center rounded-md border-0 p-0 text-gray-500 shadow-none hover:bg-background-light hover:text-gray-400"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <span className="text-sm text-danger">
            {form.formState.errors.confirmPassword.message}
          </span>
        )}
      </div>

      {/* Reset Password Button */}
      <Button
        type="submit"
        disabled={isResetting}
        className="hover:bg-background-dark/80 focus:ring-primary/20 h-12 w-full rounded-lg bg-primary/90 hover:bg-primary-hover font-medium text-white transition-all duration-200 focus:ring-2"
      >
        {isResetting ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Didn&apos;t receive the code? </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await resendOTP({ email, purpose: 'PASSWORD_RESET' });
            } catch (_error) {
              // Error is handled by the hook
            }
          }}
          disabled={isResending}
          className="text-sm text-primary hover:text-primary-hover disabled:opacity-50"
        >
          {isResending ? 'Sending...' : 'Resend'}
        </button>
      </div>

      {/* Back to Sign In */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Remember your password? </span>
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-sm text-primary hover:text-primary-hover"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
