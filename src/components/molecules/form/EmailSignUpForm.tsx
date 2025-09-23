'use client';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { useEmailSignUp } from '@/hooks/useEmailSignUp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const emailSignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

type EmailSignUpFormData = z.infer<typeof emailSignUpSchema>;

interface EmailSignUpFormProps {
  onSuccess: (data: EmailSignUpFormData) => void;
  onSwitchToSignIn: () => void;
}

export function EmailSignUpForm({ onSuccess, onSwitchToSignIn }: EmailSignUpFormProps) {
  const { signUp, isLoading } = useEmailSignUp();

  const form = useForm<EmailSignUpFormData>({
    resolver: zodResolver(emailSignUpSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: EmailSignUpFormData) => {
    try {
      // Only send email to the API, but keep name for the next step
      await signUp({ email: data.email });
      onSuccess(data); // Pass full data (including name) to onSuccess
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <Label htmlFor="name" className="mb-2 block text-sm font-medium !text-gray-900">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          {...form.register('name')}
          inputClassName="h-12 w-full rounded-lg border-gray-200 !bg-white !text-gray-900 px-4 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        {form.formState.errors.name && (
          <span className="text-sm text-red-500">{form.formState.errors.name.message}</span>
        )}
      </div>

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

      {/* Send Verification Code Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-lg bg-black font-medium !text-white transition-all duration-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-200"
      >
        {isLoading ? 'Sending...' : 'Send Verification Code'}
      </Button>

      {/* Switch to Sign In */}
      <div className="text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
