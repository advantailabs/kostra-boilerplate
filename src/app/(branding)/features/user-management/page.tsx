import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'User Management | Kostra Next.js Boilerplate',
  description:
    'Kostra includes a complete admin user management panel: paginated user list, role control, credit assignment, plan changes, onboarding status tracking, and soft delete.',
  keywords:
    'user management Next.js, admin user panel, role management, user administration, SaaS admin dashboard, Next.js boilerplate admin',
  openGraph: {
    title: 'User Management | Kostra Next.js Boilerplate',
    description:
      'Paginated user list, role control, credit assignment, plan changes, and soft delete — admin user management built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/user-management',
  },
  alternates: { canonical: 'https://kostra.io/features/user-management' },
  robots: { index: true, follow: true },
};

export default function UserManagementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'User Management in Kostra',
            description:
              'How Kostra implements admin user management with roles, credits, plan control, and soft delete.',
            url: 'https://kostra.io/features/user-management',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">User Management</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300">
              Admin
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              User{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              A production-grade admin user panel without the boilerplate. Kostra gives you a
              paginated user list with filtering, role control, credit management, plan assignment,
              and soft delete — all accessible at /app/admin/users.
            </p>
          </div>

          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Admin capabilities</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: '👥',
                  title: 'Paginated user list',
                  description: 'Browse all registered users with pagination, search by name/email, and filter by role, plan, or onboarding status.',
                },
                {
                  icon: '🛡️',
                  title: 'Role management',
                  description: 'Promote users to admin or demote to user role. Role changes take effect on the next session token refresh.',
                },
                {
                  icon: '💰',
                  title: 'Credit adjustment',
                  description: 'Manually grant or deduct credits from any user account. Each adjustment creates a CreditTransaction record with an ADMIN_GRANT type.',
                },
                {
                  icon: '📦',
                  title: 'Plan assignment',
                  description: 'Override a user\'s subscription plan from the admin panel — useful for manually applying trial plans or correcting billing issues.',
                },
                {
                  icon: '🚀',
                  title: 'Onboarding status',
                  description: 'View and reset a user\'s onboarding completion status. Useful for support agents helping users who got stuck in the flow.',
                },
                {
                  icon: '🗑️',
                  title: 'Soft delete',
                  description: 'Deactivate users without permanently deleting their data. Soft-deleted users cannot sign in but their records remain for audit purposes.',
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

          {/* API routes */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-lg font-medium text-white">Admin API routes</h2>
            <div className="space-y-2">
              {[
                { method: 'GET', route: '/api/admin/users', desc: 'List users with pagination and filters' },
                { method: 'GET', route: '/api/admin/users/[id]', desc: 'Get single user details' },
                { method: 'PATCH', route: '/api/admin/users/[id]', desc: 'Update role, plan, onboarding status' },
                { method: 'POST', route: '/api/admin/users/[id]/credits', desc: 'Adjust user credit balance' },
                { method: 'DELETE', route: '/api/admin/users/[id]', desc: 'Soft-delete user account' },
              ].map((item) => (
                <div key={item.route} className="flex items-center gap-3 rounded-lg bg-black/40 px-4 py-3">
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-xs font-medium ${item.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300' : item.method === 'POST' ? 'bg-blue-500/20 text-blue-300' : item.method === 'PATCH' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                    {item.method}
                  </span>
                  <code className="text-xs text-gray-300">{item.route}</code>
                  <span className="hidden text-xs text-gray-500 sm:block">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Protection */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-light text-white">Access protection</h2>
            <ul className="space-y-4">
              {[
                'All /api/admin/* routes check for role === "ADMIN" in the JWT before processing',
                'Next.js middleware blocks non-admin users from accessing /app/admin/* pages',
                'Admin actions are logged — the Prisma schema is ready for an audit log table',
                'Role check utility in src/validations/admin.ts reusable across all admin endpoints',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-orange-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Admin panel. Day one.</h2>
            <p className="mb-6 text-gray-400">User management is part of Kostra's complete SaaS foundation — get auth, billing, storage, and more.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
