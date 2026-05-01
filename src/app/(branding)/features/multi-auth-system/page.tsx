import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Multi-Auth System | Kostra Next.js Boilerplate',
  description:
    'Kostra supports multiple authentication strategies simultaneously — Google OAuth and email/password in parallel. Users can link providers, reset passwords, and manage sessions without losing data.',
  keywords:
    'multi-auth Next.js, OAuth email login, multiple auth providers, SaaS authentication, Next.js boilerplate',
  openGraph: {
    title: 'Multi-Auth System | Kostra Next.js Boilerplate',
    description:
      'Support Google OAuth and email/password in parallel. Users can link providers, reset passwords, and manage sessions — all built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/multi-auth-system',
  },
  alternates: { canonical: 'https://kostra.io/features/multi-auth-system' },
  robots: { index: true, follow: true },
};

export default function MultiAuthSystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Multi-Auth System in Kostra',
            description:
              'How Kostra supports Google OAuth and email/password simultaneously with provider linking and unified session management.',
            url: 'https://kostra.io/features/multi-auth-system',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-bl from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Multi-Auth System</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              Authentication
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Multi-Auth{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra lets users sign in with Google or email/password — and supports both on the
              same account. The auth layer is flexible enough to add new providers without
              restructuring the database or session logic.
            </p>
          </div>

          {/* Architecture */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Architecture</h2>
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Unified User model',
                  description:
                    'A single Prisma User record stores the canonical identity. Provider-specific fields (googleId, passwordHash) are nullable columns on the same table — no separate ProviderAccount table needed.',
                },
                {
                  step: '02',
                  title: 'Strategy selection at runtime',
                  description:
                    'The sign-in API routes detect which strategy is being used (OAuth callback vs. email/password POST) and call the appropriate service — both ultimately produce the same signed JWT.',
                },
                {
                  step: '03',
                  title: 'Consistent session shape',
                  description:
                    'Regardless of provider, the JWT payload contains the same fields: userId, email, role, and iat/exp. Middleware validation is provider-agnostic.',
                },
                {
                  step: '04',
                  title: 'OTP verification gate',
                  description:
                    'Email/password users must verify their address via a 6-digit OTP before a session is issued. Google OAuth users are considered verified by default (Google handles email verification).',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <span className="shrink-0 font-mono text-2xl font-light text-gray-600">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Capabilities</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '🔗', title: 'Provider linking', desc: 'Users signed up with email can later connect Google to the same account, and vice versa.' },
                { icon: '🔄', title: 'Password reset flow', desc: 'Time-limited reset links invalidate existing password hashes without affecting OAuth linkage.' },
                { icon: '🛡️', title: 'Role-aware sessions', desc: 'Admin and user roles are encoded in the JWT — no extra DB lookup per request.' },
                { icon: '📱', title: 'Sign-in modal', desc: 'A global Zustand-driven sign-in modal surfaces the correct auth form regardless of page context.' },
                { icon: '🚪', title: 'Clean sign-out', desc: 'Sign-out clears the HttpOnly cookie server-side and resets the Zustand auth store client-side.' },
                { icon: '⚡', title: 'Middleware protection', desc: 'Next.js middleware validates the JWT on every /app/* request — protecting all app routes automatically.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Auth — done. What's next?</h2>
            <p className="mb-6 text-gray-400">
              Kostra pairs multi-auth with Stripe billing, file storage, and an admin dashboard.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
