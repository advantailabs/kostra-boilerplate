import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Resend & AWS SES Integration | Kostra Next.js Boilerplate',
  description:
    'Kostra uses a pluggable factory-pattern email driver system — swap between Resend and AWS SES with a single environment variable. No code changes, no vendor lock-in.',
  keywords:
    'Resend Next.js, AWS SES Next.js, email driver factory, pluggable email provider, SaaS email boilerplate, switch email provider',
  openGraph: {
    title: 'Resend & AWS SES Integration | Kostra Next.js Boilerplate',
    description:
      'Factory-pattern email drivers for Resend and AWS SES — switch providers with one env var. Built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/resend-aws-ses-integration',
  },
  alternates: { canonical: 'https://kostra.io/features/resend-aws-ses-integration' },
  robots: { index: true, follow: true },
};

export default function ResendAwsSesIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Resend & AWS SES Integration in Kostra',
            description:
              'How Kostra implements a pluggable email driver factory supporting Resend and AWS SES.',
            url: 'https://kostra.io/features/resend-aws-ses-integration',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-bl from-sky-500/10 via-blue-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Resend & AWS SES Integration</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
              Email
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Resend & AWS SES{' '}
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                Integration
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              No email vendor lock-in. Kostra's driver-based email system lets you start with
              Resend for simplicity and switch to AWS SES for scale — by changing one environment
              variable.
            </p>
          </div>

          {/* Provider comparison */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Provider comparison</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300"></th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resend</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">AWS SES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { label: 'Best for', resend: 'Startups & early-stage', ses: 'Scale & enterprise' },
                    { label: 'Pricing', resend: '100 emails/day free, then pay-as-you-go', ses: '$0.10 per 1,000 emails' },
                    { label: 'Setup complexity', resend: 'API key only', ses: 'AWS IAM + domain verification' },
                    { label: 'Deliverability', resend: 'High (managed reputation)', ses: 'Excellent (if configured)' },
                    { label: 'Config in Kostra', resend: 'RESEND_API_KEY', ses: 'AWS_SES_* env vars' },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">{row.label}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{row.resend}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{row.ses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Factory pattern architecture</h2>
            <div className="space-y-4">
              {[
                { title: 'EmailDriver interface (src/lib/email/types.ts)', code: 'interface EmailDriver {\n  send(to: string, subject: string, html: string): Promise<void>;\n}' },
                { title: 'ResendDriver (src/lib/email/drivers/resend.ts)', code: 'class ResendDriver implements EmailDriver {\n  async send(to, subject, html) {\n    await resend.emails.send({ from, to, subject, html });\n  }\n}' },
                { title: 'SESDriver (src/lib/email/drivers/ses.ts)', code: 'class SESDriver implements EmailDriver {\n  async send(to, subject, html) {\n    await ses.sendEmail({ Source: from, Destination: { ToAddresses: [to] }, ... });\n  }\n}' },
                { title: 'EmailFactory (src/lib/email/factory.ts)', code: 'export function getEmailDriver(): EmailDriver {\n  return process.env.EMAIL_DRIVER === \'ses\'\n    ? new SESDriver()\n    : new ResendDriver();\n}' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-300">{item.title}</h3>
                  <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 font-mono text-xs text-gray-400">
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Usage */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-lg font-medium text-white">Using the email system in your code</h2>
            <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 font-mono text-xs text-gray-400">
{`import { getEmailDriver } from '@/lib/email/factory';
import { otpEmailTemplate } from '@/lib/email/templates/otp';

const driver = getEmailDriver();
await driver.send(
  user.email,
  'Your verification code',
  otpEmailTemplate({ otp: '123456', name: user.name })
);`}
            </pre>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">No vendor lock-in. Ever.</h2>
            <p className="mb-6 text-gray-400">Email drivers are one part of Kostra's complete SaaS foundation — get the full stack.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
