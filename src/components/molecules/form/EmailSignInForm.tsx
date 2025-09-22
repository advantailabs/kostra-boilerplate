'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { useEmailSignIn } from '@/hooks/useEmailSignIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const emailSignInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type EmailSignInFormData = z.infer<typeof emailSignInSchema>;

interface EmailSignInFormProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

export function EmailSignInForm({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
}: EmailSignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const emailSignInMutation = useEmailSignIn();

  const form = useForm<EmailSignInFormData>({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailSignInFormData) => {
    try {
      await emailSignInMutation.mutateAsync(data);
      onSuccess();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      {/* Email Field */}
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium !text-gray-900">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register('email')}
          inputClassName="h-12 w-full rounded-lg border-gray-200 !bg-white !text-gray-900 px-4 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        {form.formState.errors.email && (
          <span className="text-sm text-red-500">{form.formState.errors.email.message}</span>
        )}
      </div>

      {/* Password Field */}
      <div>
        <Label htmlFor="password" className="mb-2 block text-sm font-medium !text-gray-900">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...form.register('password')}
            inputClassName="h-12 w-full rounded-lg border-gray-200 !bg-white !text-gray-900 px-4 pr-12 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          <span className="text-sm text-red-500">{form.formState.errors.password.message}</span>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Forgot Password?
        </button>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={emailSignInMutation.isPending}
        className="h-12 w-full rounded-lg bg-black font-medium !text-white transition-all duration-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-200"
      >
        {emailSignInMutation.isPending ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Switch to Sign Up */}
      <div className="text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
