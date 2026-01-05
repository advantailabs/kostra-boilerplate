'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { useOTPVerification } from '@/hooks/useOTPVerification';
import { useResendOTP } from '@/hooks/useResendOTP';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const otpVerificationSchema = z
  .object({
    otp0: z.string().length(1, 'Required'),
    otp1: z.string().length(1, 'Required'),
    otp2: z.string().length(1, 'Required'),
    otp3: z.string().length(1, 'Required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;

interface OTPVerificationFormProps {
  email: string;
  name: string;
  onSuccess: () => void;
  onResendOTP: () => void;
}

export function OTPVerificationForm({
  email,
  name,
  onSuccess,
  onResendOTP,
}: OTPVerificationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpVerificationMutation = useOTPVerification();
  const { resendOTP, isLoading: isResending } = useResendOTP();

  const form = useForm<OTPVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp0: '',
      otp1: '',
      otp2: '',
      otp3: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleOTPChange = useCallback(
    (index: number, value: string, e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits
      const digit = value.replace(/\D/g, '');

      // Update the form value
      form.setValue(`otp${index}` as keyof OTPVerificationFormData, digit);

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
          form.setValue(`otp${i}` as keyof OTPVerificationFormData, digit);
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

  const onSubmit = async (data: OTPVerificationFormData) => {
    try {
      const otp = `${data.otp0}${data.otp1}${data.otp2}${data.otp3}`;
      await otpVerificationMutation.mutateAsync({
        email,
        name,
        password: data.password,
        otp,
      });
      onSuccess();
    } catch (_error) {
      // Error is handled by the mutation
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
              {...form.register(`otp${index}` as keyof OTPVerificationFormData, {
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

      {/* Password Field */}
      <div>
        <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-400">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            {...form.register('password')}
            inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 pr-12 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <span className="text-sm text-danger">{form.formState.errors.password.message}</span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-400">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            {...form.register('confirmPassword')}
            inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 pr-12 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
          >
            {showConfirmPassword ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <span className="text-sm text-danger">
            {form.formState.errors.confirmPassword.message}
          </span>
        )}
      </div>

      {/* Sign Up Button */}
      <Button
        type="submit"
        disabled={otpVerificationMutation.isPending}
        className="hover:bg-background-dark/80 focus:ring-primary/20 h-12 w-full rounded-lg bg-primary/90 hover:bg-primary-hover font-medium text-white transition-all duration-200 focus:ring-2"
      >
        {otpVerificationMutation.isPending ? 'Creating Account...' : 'Sign Up'}
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Didn&apos;t receive the code? </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await resendOTP({ email, purpose: 'SIGNUP' });
              onResendOTP();
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
    </form>
  );
}
