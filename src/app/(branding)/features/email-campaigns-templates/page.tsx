import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Email Campaigns & Templates | Kostra Next.js Boilerplate',
  description:
    'Kostra includes a production-ready email system: OTP, password reset, and onboarding templates with a unified sending interface supporting Resend and AWS SES as drivers.',
  keywords:
    'email templates Next.js, transactional email SaaS, OTP email, password reset email, email campaigns boilerplate, Resend AWS SES',
  openGraph: {
    title: 'Email Campaigns & Templates | Kostra Next.js Boilerplate',
    description:
      'OTP verification, password reset, and onboarding email templates with Resend/AWS SES support — built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/email-campaigns-templates',
  },
  alternates: { canonical: 'https://kostra.io/features/email-campaigns-templates' },
  robots: { index: true, follow: true },
};

export default function EmailCampaignsTemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Email Campaigns & Templates in Kostra',
            description:
              'How Kostra implements transactional email templates and a pluggable email driver system.',
            url: 'https://kostra.io/features/email-campaigns-templates',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Email Campaigns & Templates</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300">
              Email
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Email Campaigns{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                & Templates
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra ships with a complete email system — pre-built transactional templates,
              a factory-pattern driver architecture, and support for both Resend and AWS SES.
              Configure once, send from anywhere in your codebase.
            </p>
          </div>

          {/* Templates */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Built-in email templates</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '🔢', title: 'OTP Verification', desc: 'Branded email with a 6-digit code and expiry notice. Sent on signup and account recovery.', trigger: 'POST /api/auth/verify-otp' },
                { icon: '🔑', title: 'Password Reset', desc: 'Time-limited link email for forgot-password flow. Token expires after 15 minutes.', trigger: 'POST /api/auth/forgot-password' },
                { icon: '👋', title: 'Welcome / Onboarding', desc: 'Post-signup onboarding email with product introduction and next steps.', trigger: 'On user creation' },
                { icon: '📬', title: 'Contact Confirmation', desc: 'Auto-acknowledgement email sent to contact form submitters.', trigger: 'POST /api/contact' },
                { icon: '📣', title: 'Admin Alert', desc: 'Internal notification email sent to admin when a new lead is captured.', trigger: 'POST /api/contact' },
                { icon: '🛠️', title: 'Custom templates', desc: 'Add new templates under src/lib/email/templates/ — they auto-register with the factory.', trigger: 'EmailFactory.send()' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                  <p className="mb-2 text-sm text-gray-400">{item.desc}</p>
                  <p className="font-mono text-xs text-gray-600">Triggered: {item.trigger}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Email architecture</h2>
            <div className="space-y-4">
              {[
                { title: 'Factory pattern', desc: 'EmailFactory (src/lib/email/factory.ts) resolves the correct driver at runtime based on the EMAIL_DRIVER environment variable.' },
                { title: 'Driver interface', desc: 'Each driver (Resend, SES) implements the same EmailDriver interface — send(to, subject, html) — making them interchangeable.' },
                { title: 'Template rendering', desc: 'Templates are plain TypeScript functions that return an HTML string. They receive typed data objects and use string interpolation — no external template engine.' },
                { title: 'Driver swap', desc: 'Switch between Resend and SES by changing EMAIL_DRIVER=resend to EMAIL_DRIVER=ses in your .env — no code changes required.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Config */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">Required environment variables</h2>
            <div className="space-y-2">
              {[
                { key: 'EMAIL_DRIVER', value: '"resend" | "ses"' },
                { key: 'RESEND_API_KEY', value: 'your-resend-api-key (if using Resend)' },
                { key: 'AWS_SES_ACCESS_KEY_ID', value: 'your-aws-key (if using SES)' },
                { key: 'AWS_SES_SECRET_ACCESS_KEY', value: 'your-aws-secret (if using SES)' },
                { key: 'AWS_SES_REGION', value: 'e.g. us-east-1 (if using SES)' },
                { key: 'EMAIL_FROM', value: 'noreply@yourdomain.com' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-lg bg-black/40 px-4 py-2.5">
                  <code className="text-xs font-medium text-teal-300">{item.key}</code>
                  <span className="text-xs text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-teal-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Email working out of the box.</h2>
            <p className="mb-6 text-gray-400">Transactional email is one of 50+ features in Kostra — get the complete SaaS stack.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
