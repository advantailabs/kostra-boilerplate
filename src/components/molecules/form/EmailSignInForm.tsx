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
    } catch (_error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      {/* Email Field */}
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-400">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register('email')}
          inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {form.formState.errors.email && (
          <span className="text-sm text-danger">{form.formState.errors.email.message}</span>
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
            placeholder="Enter your password"
            {...form.register('password')}
            inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 pr-12 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 flex h-5 w-5 min-w-0 -translate-y-1/2 items-center justify-center rounded-md border-0 p-0 text-gray-400-muted shadow-none hover:bg-background-light hover:text-gray-400"
          >
            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.password && (
          <span className="text-sm text-danger">{form.formState.errors.password.message}</span>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onForgotPassword}
          className="!h-auto !min-w-0 !border-0 !bg-transparent !p-0 text-sm !text-primary !shadow-none hover:!bg-transparent hover:text-primary-hover focus:!bg-transparent"
        >
          Forgot Password?
        </Button>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className=" focus:ring-primary/20 h-12 w-full rounded-lg bg-primary/90 hover:bg-primary-hover font-medium text-white transition-all duration-200 focus:ring-2"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Switch to Sign Up */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-sm text-primary hover:text-primary-hover"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
