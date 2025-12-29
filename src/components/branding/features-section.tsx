'use client';

import {
  RiArticleFill,
  RiFileUploadFill,
  RiKeyFill,
  RiMailSendFill,
  RiMoneyDollarCircleFill,
  RiServerFill,
  RiShieldUserFill,
  RiUserAddFill,
} from '@remixicon/react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Blog & Categories',
    description:
      'Complete blog management system with categories, tags, rich content editor, and SEO-friendly slugs. Create, edit, and organize your content effortlessly.',
    icon: RiArticleFill,
  },
  {
    title: 'Lead Capture Management',
    description:
      'Comprehensive contact form system with status tracking, admin notes, and lead management. Capture and manage leads with purpose-based categorization.',
    icon: RiUserAddFill,
  },
  {
    title: 'Stripe Integration',
    description:
      'Full Stripe payment integration with subscription management, one-time payments, webhooks, and billing portal. Handle payments and subscriptions seamlessly.',
    icon: RiMoneyDollarCircleFill,
  },
  {
    title: 'Email Campaigns & Templates',
    description:
      'Professional email template system with OTP verification, password reset, and marketing email support. Customizable templates for all your communication needs.',
    icon: RiMailSendFill,
  },
  {
    title: 'Resend & AWS SES Integration',
    description:
      'Flexible email driver system supporting both Resend and AWS SES. Switch between providers easily with a unified interface and factory pattern implementation.',
    icon: RiServerFill,
  },
  {
    title: 'User Management',
    description:
      'Complete admin user management with roles, permissions, filtering, pagination, and soft delete. Manage users, credits, plans, and onboarding status.',
    icon: RiShieldUserFill,
  },
  {
    title: 'Multi-Auth System',
    description:
      'Flexible authentication with Google OAuth and email/password. OTP verification, password reset, JWT-based sessions, and secure cookie management.',
    icon: RiKeyFill,
  },
  {
    title: 'Credit System',
    description:
      'Built-in credit management with transaction history, balance tracking, and integration with Stripe for credit purchases. Perfect for usage-based billing.',
    icon: RiMoneyDollarCircleFill,
  },
  {
    title: 'File Management System',
    description:
      'Complete file upload and management system with S3/R2 integration, drag-and-drop interface, file organization, and secure pre-signed URLs for uploads and downloads.',
    icon: RiFileUploadFill,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative -mt-1 bg-black py-16 sm:py-20">
      <div className="bg-gray-800/30 absolute inset-x-0 top-0 h-px" />
      <div className="from-emerald-950/5 to-black/0 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-light text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Powerful Features Built-In
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400 sm:text-xl">
            Everything you need to build a modern SaaS application. From content management to
            payments, email, and user administration - it&apos;s all included.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gray-500/20 bg-white/5 hover:border-white/20 hover:bg-white/10 group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all sm:p-6"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className=" flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-primary sm:h-12 sm:w-12">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400/80 sm:text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
