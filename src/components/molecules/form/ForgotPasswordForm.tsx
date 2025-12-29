'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
  onBackToSignIn: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBackToSignIn }: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data);
      onSuccess(data.email);
    } catch (_error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-400">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...form.register('email')}
          inputClassName="h-12 w-full rounded-lg border-border bg-background text-gray-400 px-4 placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {form.formState.errors.email && (
          <span className="text-sm text-danger">{form.formState.errors.email.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="focus:ring-primary/20 h-12 w-full rounded-lg bg-primary/90 hover:bg-primary-hover font-medium text-white transition-all duration-200 focus:ring-2"
      >
        {isLoading ? 'Sending...' : 'Send Reset Code'}
      </Button>

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
