'use client';

import { Alert, AlertDescription } from '@/components/atom/Alert';
import { Button } from '@/components/atom/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atom/Card';
import { Input } from '@/components/atom/Input';
import { Textarea } from '@/components/atom/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { useCreateContact } from '@/hooks/useContacts';
import { useAuthStore } from '@/store/auth';
import { CONTACT_PURPOSES } from '@/types/contact';
import { ContactFormData, contactFormSchema } from '@/validations/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      purpose: 'GENERAL_INQUIRY',
      message: '',
    },
  });

  const createContact = useCreateContact();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await createContact.mutateAsync({
        name: data.name,
        email: data.email,
        purpose: data.purpose,
        message: data.message,
      });
      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error?.message || 'Failed to submit contact form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-semibold text-white">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-base text-gray-300">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose the most convenient way to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-white">Email Support</h3>
                    <p className="text-gray-300">hi@peon.sh</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Response Time</CardTitle>
                <CardDescription className="text-gray-400">
                  We typically respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>General Inquiries</span>
                    <span className="font-medium text-white">24 hours</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Technical Support</span>
                    <span className="font-medium text-white">12 hours</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Billing Issues</span>
                    <span className="font-medium text-white">6 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Name *
                    </label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Your full name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  {/* Purpose */}
                  <div className="space-y-2">
                    <label htmlFor="purpose" className="text-sm font-medium text-gray-300">
                      Purpose *
                    </label>
                    <Select
                      value={watch('purpose')}
                      onValueChange={(value: string) =>
                        setValue('purpose', value as ContactFormData['purpose'])
                      }
                    >
                      <SelectTrigger className={errors.purpose ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_PURPOSES.map(purpose => (
                          <SelectItem key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-sm text-red-600">{errors.purpose.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <Alert className="mt-6 border-green-900/50 bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-200">
                      Thank you! Your message has been sent successfully. We'll get back to you
                      soon.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert className="mt-6 border-red-900/50 bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-200">{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
