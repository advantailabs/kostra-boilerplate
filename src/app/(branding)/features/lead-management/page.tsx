import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lead Capture Management | Kostra Next.js Boilerplate',
  description:
    'Kostra includes a complete lead capture and contact management system: contact forms, status tracking, purpose-based categorisation, admin notes, and a filterable lead inbox.',
  keywords:
    'lead capture Next.js, contact form management, lead management system, SaaS lead tracking, contact management boilerplate',
  openGraph: {
    title: 'Lead Capture Management | Kostra Next.js Boilerplate',
    description:
      'Contact forms, status tracking, purpose categorisation, admin notes, and a filterable lead inbox — built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/lead-management',
  },
  alternates: { canonical: 'https://kostra.io/features/lead-management' },
  robots: { index: true, follow: true },
};

export default function LeadManagementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Lead Capture Management in Kostra',
            description:
              'How Kostra implements contact forms, lead tracking, status management, and an admin lead inbox.',
            url: 'https://kostra.io/features/lead-management',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Lead Capture Management</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-300">
              CRM
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Lead Capture{' '}
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Turn your contact form into a lightweight CRM. Kostra captures leads via a public
              contact form, stores them in PostgreSQL, and surfaces them in an admin inbox with
              status management and notes.
            </p>
          </div>

          {/* Features */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">What's included</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: '📬',
                  title: 'Contact form',
                  description: 'Public contact form at /contact with name, email, subject, purpose, and message fields. Validated server-side and stored in the Contact Prisma model.',
                },
                {
                  icon: '🏷️',
                  title: 'Purpose categorisation',
                  description: 'Each submission is tagged with a purpose (e.g. sales, support, partnership). Admins can filter the inbox by purpose to prioritise response.',
                },
                {
                  icon: '📊',
                  title: 'Status tracking',
                  description: 'Leads move through NEW → IN_PROGRESS → RESOLVED → CLOSED statuses. Status changes are timestamped and visible in the admin dashboard.',
                },
                {
                  icon: '📝',
                  title: 'Admin notes',
                  description: 'Admins can add internal notes to any contact submission — useful for tracking follow-up actions or recording conversation outcomes.',
                },
                {
                  icon: '🔍',
                  title: 'Filterable inbox',
                  description: 'The admin contact management page at /app/contact-management supports filtering by status, purpose, and date range with pagination.',
                },
                {
                  icon: '📧',
                  title: 'Email notification',
                  description: 'On form submission, an acknowledgement email is sent to the submitter and an alert email is sent to the admin — using the configured email driver.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 text-2xl">{item.icon}</div>
                  <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Key capabilities</h2>
            <ul className="space-y-4">
              {[
                'Zod schema validation on both client and server for the contact form',
                'Prisma Contact model with name, email, subject, purpose, message, status, and notes',
                'GET /api/contact with filters for admin lead inbox',
                'PATCH /api/contact/[id] for status updates and note additions',
                'Rate limiting on POST /api/contact prevents form spam',
                'React Query hooks: useContacts.ts for admin data fetching with caching',
                'Exportable contact list for use in external CRMs or email tools',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-pink-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">From form to pipeline. No CRM subscription needed.</h2>
            <p className="mb-6 text-gray-400">Lead management is part of Kostra's complete SaaS stack — get auth, billing, storage, and more.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
