import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features | Kostra – Production-Ready Next.js SaaS Boilerplate',
  description:
    'Explore every feature built into Kostra: multi-auth, Stripe billing, file management, blog system, email campaigns, credit system, and more. Ship your SaaS faster.',
  keywords:
    'Next.js boilerplate features, SaaS starter kit, Stripe integration, authentication, file management, blog system, email campaigns, credit system',
  openGraph: {
    title: 'Features | Kostra – Production-Ready Next.js SaaS Boilerplate',
    description:
      'Explore every feature built into Kostra: multi-auth, Stripe billing, file management, blog system, email campaigns, credit system, and more.',
    type: 'website',
    url: 'https://kostra.io/features',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features | Kostra – Production-Ready Next.js SaaS Boilerplate',
    description:
      'Explore every feature built into Kostra: multi-auth, Stripe billing, file management, blog system, email campaigns, credit system, and more.',
  },
  alternates: {
    canonical: 'https://kostra.io/features',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: 'Modern Authentication',
    slug: 'modern-authentication',
    description:
      'Google OAuth and email/password sign-in with OTP verification, JWT sessions, and secure cookie management — all wired up and ready to go.',
    icon: '🔐',
    tags: ['Google OAuth', 'Email OTP', 'JWT', 'Secure Cookies'],
  },
  {
    title: 'Multi-Auth System',
    slug: 'multi-auth-system',
    description:
      'Support multiple authentication strategies in parallel. Users can link Google and email accounts, switch providers, and reset passwords without losing data.',
    icon: '🛡️',
    tags: ['OAuth', 'Email/Password', 'Password Reset', 'Session Management'],
  },
  {
    title: 'File Management System',
    slug: 'file-management-system',
    description:
      'Full S3/R2-compatible file storage with pre-signed URL uploads, drag-and-drop UI, progress tracking, and per-user file organisation.',
    icon: '📁',
    tags: ['S3', 'Cloudflare R2', 'Pre-signed URLs', 'Drag & Drop'],
  },
  {
    title: 'Stripe Integration',
    slug: 'stripe-integration',
    description:
      'Production-ready Stripe billing with subscriptions, one-time payments, customer portal, and webhook event handling — fully type-safe.',
    icon: '💳',
    tags: ['Subscriptions', 'One-time Payments', 'Webhooks', 'Customer Portal'],
  },
  {
    title: 'Credit System',
    slug: 'credit-system',
    description:
      'Built-in usage-based billing with credit ledger, balance tracking, transaction history, and Stripe-powered top-ups.',
    icon: '💰',
    tags: ['Usage Billing', 'Credit Ledger', 'Transaction History', 'Stripe'],
  },
  {
    title: 'Blog & Categories',
    slug: 'blog-and-categories',
    description:
      'Full CMS with rich-text editor, category system, SEO slugs, status management, and a public-facing blog — no third-party CMS needed.',
    icon: '✍️',
    tags: ['Rich Text Editor', 'Categories', 'SEO Slugs', 'Draft/Publish'],
  },
  {
    title: 'Lead Capture Management',
    slug: 'lead-management',
    description:
      'Contact form system with purpose-based categorisation, status tracking, admin notes, and a filterable lead inbox for your team.',
    icon: '📬',
    tags: ['Contact Forms', 'Lead Inbox', 'Status Tracking', 'Admin Notes'],
  },
  {
    title: 'Email Campaigns & Templates',
    slug: 'email-campaigns-templates',
    description:
      'Transactional and marketing email templates for OTP, password reset, and onboarding — with a unified sending interface.',
    icon: '📧',
    tags: ['Transactional Email', 'OTP', 'Password Reset', 'Templates'],
  },
  {
    title: 'Resend & AWS SES Integration',
    slug: 'resend-aws-ses-integration',
    description:
      'Pluggable email driver system using a factory pattern. Switch between Resend and AWS SES via a single environment variable.',
    icon: '📨',
    tags: ['Resend', 'AWS SES', 'Factory Pattern', 'Driver System'],
  },
  {
    title: 'User Management',
    slug: 'user-management',
    description:
      'Admin panel with paginated user list, role control, credit assignment, plan changes, onboarding status, and soft delete.',
    icon: '👥',
    tags: ['Admin Panel', 'Roles', 'Pagination', 'Soft Delete'],
  },
  {
    title: 'Responsive Design',
    slug: 'responsive-design',
    description:
      'Tailwind CSS-powered responsive layout that looks sharp on every screen size, with dark mode and accessible component patterns.',
    icon: '📱',
    tags: ['Tailwind CSS', 'Dark Mode', 'Accessible', 'Mobile-first'],
  },
  {
    title: 'File Management',
    slug: 'file-management',
    description:
      'End-to-end file lifecycle management — upload, organise, preview, share, and delete — backed by cloud object storage.',
    icon: '🗂️',
    tags: ['Upload', 'Preview', 'Sharing', 'Cloud Storage'],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Kostra Features',
            description:
              'All features included in the Kostra Next.js SaaS boilerplate — authentication, billing, file management, blog, email, and more.',
            url: 'https://kostra.io/features',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gradient-to-l from-emerald-500/8 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
            50+ built-in features
          </div>
          <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
            Everything your SaaS needs.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Already built.
            </span>
          </h1>
          <p className="text-lg text-gray-400 sm:text-xl">
            Kostra ships with every layer of a production SaaS — auth, billing, storage, email,
            content, and admin — so you start at feature-complete, not zero.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.slug}
              href={`/features/${feature.slug}`}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h2 className="mb-2 text-lg font-medium text-white group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute right-4 top-4 text-gray-600 transition-colors group-hover:text-gray-400">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-light text-white sm:text-3xl">
            Ready to ship your SaaS?
          </h2>
          <p className="mb-8 text-gray-400">
            Get access to all features for a one-time payment of $150. No subscriptions.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Get Kostra →
          </Link>
        </div>
      </div>
    </>
  );
}
