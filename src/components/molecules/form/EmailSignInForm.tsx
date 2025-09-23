'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeSlashIcon } from '@/components/icons/EyeSlashIcon';
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
  const { signIn, isLoading } = useEmailSignIn();

  const form = useForm<EmailSignInFormData>({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailSignInFormData) => {
    try {
      await signIn(data);
      onSuccess();
    } catch (error) {
      // Error is handled by the hook
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 flex h-5 w-5 min-w-0 -translate-y-1/2 items-center justify-center rounded-md border-0 p-0 !text-gray-600 shadow-none hover:bg-gray-100 hover:!text-gray-800"
          >
            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.password && (
          <span className="text-sm text-red-500">{form.formState.errors.password.message}</span>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onForgotPassword}
          className="!h-auto !min-w-0 !border-0 !bg-transparent !p-0 text-sm !text-blue-600 !shadow-none hover:!bg-transparent hover:!text-blue-800 focus:!bg-transparent"
        >
          Forgot Password?
        </Button>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-lg bg-black font-medium !text-white transition-all duration-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-200"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
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
