import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Next.js Boilerplate Features for Developers | Kostra',
  description:
    'A developer-focused breakdown of Kostra\'s technical architecture — Next.js App Router, Prisma ORM, React Query, Zustand, JWT auth, S3 storage, Stripe billing, and more.',
  keywords:
    'Next.js boilerplate features, developer Next.js starter, App Router boilerplate, Prisma Next.js, React Query SaaS, TypeScript boilerplate',
  openGraph: {
    title: 'Next.js Boilerplate Features for Developers | Kostra',
    description:
      'Technical deep-dive into Kostra\'s architecture — App Router, Prisma, React Query, Zustand, JWT, S3, Stripe, and TypeScript throughout.',
    type: 'article',
    url: 'https://kostra.io/nextjs-boilerplate-features',
  },
  alternates: { canonical: 'https://kostra.io/nextjs-boilerplate-features' },
  robots: { index: true, follow: true },
};

const techStack = [
  { category: 'Framework', items: [{ name: 'Next.js 14+', desc: 'App Router, Server Components, RSC, and API route handlers — not Pages Router.' }, { name: 'TypeScript', desc: 'Strict mode enabled throughout. All API responses and Prisma types are fully typed.' }] },
  { category: 'Database', items: [{ name: 'Prisma ORM', desc: 'Type-safe database client with migrations, relations, and a clean schema.prisma.' }, { name: 'PostgreSQL', desc: 'Production-grade relational database. Schema includes User, Blog, Category, Contact, File, CreditTransaction, and Package models.' }] },
  { category: 'Auth', items: [{ name: 'JWT + HttpOnly Cookies', desc: 'Signed JWTs in HttpOnly, Secure, SameSite=Lax cookies. No NextAuth dependency.' }, { name: 'Google OAuth + Email/Password', desc: 'Two auth strategies sharing a single User model. OTP verification for email signups.' }] },
  { category: 'Data Fetching', items: [{ name: 'React Query (TanStack)', desc: 'All client-side data fetching goes through React Query. Caching, invalidation, and loading states handled automatically.' }, { name: 'Custom hooks', desc: 'useFiles, useBlogs, useContacts, usePackages, useCredits — one hook per domain, all built on React Query.' }] },
  { category: 'State Management', items: [{ name: 'Zustand', desc: 'Lightweight stores for auth (useAuthStore), credits (useCreditsStore), and UI state. No Redux complexity.' }] },
  { category: 'Storage', items: [{ name: 'S3 / Cloudflare R2', desc: 'Pre-signed URL upload pattern — files go direct from browser to object storage. @aws-sdk/client-s3 for both S3 and R2.' }] },
  { category: 'Payments', items: [{ name: 'Stripe', desc: 'stripe-node SDK with full TypeScript types. Subscriptions, one-time payments, customer portal, and webhook verification.' }] },
  { category: 'Email', items: [{ name: 'Resend / AWS SES', desc: 'Factory-pattern driver system. Switch providers via EMAIL_DRIVER env var — no code changes.' }] },
  { category: 'Styling', items: [{ name: 'Tailwind CSS v3', desc: 'Utility-first CSS with custom design tokens. Dark-first theme configured in tailwind.config.ts.' }, { name: 'Framer Motion', desc: 'Declarative animations for page sections, hover states, and entrance effects.' }] },
];

export default function NextjsBoilerplateFeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Next.js Boilerplate Features for Developers — Kostra',
            description:
              'Technical breakdown of Kostra\'s architecture: Next.js App Router, Prisma, React Query, Zustand, JWT, S3, Stripe.',
            url: 'https://kostra.io/nextjs-boilerplate-features',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
              For Developers
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Built for how{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                developers work
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra is a production-grade Next.js SaaS boilerplate — not a tutorial starter.
              Every architectural decision is made for real projects: type safety throughout,
              clean separation of concerns, and zero vendor lock-in.
            </p>
          </div>

          {/* Tech stack */}
          <section className="mb-20">
            <h2 className="mb-10 text-2xl font-light text-white">Full tech stack</h2>
            <div className="space-y-8">
              {techStack.map((section) => (
                <div key={section.category}>
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
                    {section.category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h4 className="mb-1 font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Folder structure */}
          <section className="mb-20">
            <h2 className="mb-6 text-2xl font-light text-white">Directory structure</h2>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-gray-400">
{`src/
├── app/
│   ├── (branding)/          # Public marketing pages (SSG)
│   ├── api/                 # API route handlers
│   │   ├── auth/            # Sign-in, sign-up, OTP, reset
│   │   ├── billing/         # Stripe payment flows
│   │   ├── webhooks/        # Stripe webhook processor
│   │   ├── files/           # File CRUD
│   │   ├── file-upload/     # Pre-signed URL generation
│   │   ├── blogs/           # Blog CRUD
│   │   ├── categories/      # Category CRUD
│   │   ├── contact/         # Lead capture
│   │   ├── users/           # User self-service
│   │   └── admin/           # Admin-only endpoints
│   └── app/                 # Protected app routes
│       ├── admin/           # Admin dashboard
│       ├── files/           # File manager
│       ├── blogs/           # Blog manager
│       └── settings/        # User settings
├── components/
│   ├── atom/                # Buttons, inputs, badges
│   ├── molecules/           # Form groups, cards
│   └── organisms/           # Navigation, panels
├── hooks/                   # React Query hooks (useFiles, useBlogs…)
├── lib/
│   ├── auth/                # JWT utilities
│   ├── email/               # Email factory + drivers
│   └── prisma/              # Prisma client singleton
├── services/
│   ├── internal/            # Business logic
│   ├── repositories/        # DB queries
│   └── external/            # Stripe, S3 clients
├── store/                   # Zustand stores
└── types/                   # TypeScript interfaces`}
              </pre>
            </div>
          </section>

          {/* Developer quality */}
          <section className="mb-20">
            <h2 className="mb-8 text-2xl font-light text-white">Developer experience</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '🔒', title: 'Strict TypeScript', desc: 'tsconfig.json with strict: true. Explicit return types on API handlers. No any casts.' },
                { icon: '🧪', title: 'Test infrastructure', desc: 'Jest configured with test helpers, global setup/teardown, and example API integration tests.' },
                { icon: '🐳', title: 'Docker ready', desc: 'Dockerfile and docker-compose.yml in /infra for local dev and production containerisation.' },
                { icon: '📐', title: 'Conventional commits', desc: 'Git workflow with branch naming conventions and commit message standards documented.' },
                { icon: '🔌', title: 'Extensible patterns', desc: 'New features follow established patterns — add a new API route, hook, and service without breaking existing code.' },
                { icon: '⚡', title: 'SSG where possible', desc: 'Public pages (landing, features, blog) use Static Site Generation for maximum performance and SEO.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">
              Production architecture. Day one.
            </h2>
            <p className="mb-6 text-gray-400">
              Get the complete Kostra codebase — one payment, full source, no recurring fees.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Get Kostra — $150 →
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40">
                Browse all features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
