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
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      onSuccess(data.email);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium !text-gray-900">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...form.register('email')}
          inputClassName="h-12 w-full rounded-lg border-gray-200 !bg-white !text-gray-900 px-4 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        {form.formState.errors.email && (
          <span className="text-sm text-red-500">{form.formState.errors.email.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="h-12 w-full rounded-lg bg-black font-medium !text-white transition-all duration-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-200"
      >
        {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Code'}
      </Button>

      {/* Back to Sign In */}
      <div className="text-center">
        <span className="text-sm text-gray-600">Remember your password? </span>
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
