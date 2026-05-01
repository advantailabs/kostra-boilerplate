import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog & Categories | Kostra Next.js Boilerplate',
  description:
    'Kostra ships a full CMS with rich-text editor, category system, SEO-friendly slugs, draft/publish workflow, and a public blog — no third-party CMS required.',
  keywords:
    'Next.js blog CMS, blog management system, rich text editor, category management, SEO slugs, SaaS boilerplate blog',
  openGraph: {
    title: 'Blog & Categories | Kostra Next.js Boilerplate',
    description:
      'Full blog CMS with rich-text editor, categories, SEO slugs, and draft/publish workflow — built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/blog-and-categories',
  },
  alternates: { canonical: 'https://kostra.io/features/blog-and-categories' },
  robots: { index: true, follow: true },
};

export default function BlogAndCategoriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Blog & Categories System in Kostra',
            description:
              'How Kostra implements a full blog CMS with rich-text editing, categories, SEO slugs, and draft/publish workflow.',
            url: 'https://kostra.io/features/blog-and-categories',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/3 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">Blog & Categories</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
              Content
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              Blog &{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Categories
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              A full content management system without the external CMS. Kostra's blog module
              gives you a rich-text editor, category management, SEO slugs, draft/publish control,
              and a public-facing blog — all managed from within your app.
            </p>
          </div>

          {/* Features */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">What's included</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: '✏️',
                  title: 'Rich-text editor',
                  description: 'Integrated editor with formatting, headings, lists, links, images, and code blocks. Content is stored as structured JSON in PostgreSQL.',
                },
                {
                  icon: '🏷️',
                  title: 'Category system',
                  description: 'Create, edit, and assign categories to posts. Categories have their own slugs and can be used as navigation filters on the public blog.',
                },
                {
                  icon: '🔗',
                  title: 'SEO-friendly slugs',
                  description: 'Auto-generated slugs from post titles, editable pre-publish. Each blog post and category has a unique, human-readable URL path.',
                },
                {
                  icon: '📝',
                  title: 'Draft / Publish workflow',
                  description: 'Save posts as drafts, preview before publishing, and publish with a single click. Published status is queryable for the public blog API.',
                },
                {
                  icon: '🌐',
                  title: 'Public blog page',
                  description: 'A statically generated public blog at /blog with individual post pages at /blog/[slug]. Fetches only published posts from the API.',
                },
                {
                  icon: '👤',
                  title: 'Author attribution',
                  description: 'Blog posts are linked to the authoring User record, enabling author pages and bylines without extra configuration.',
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
            <h2 className="mb-6 text-lg font-medium text-white">API routes</h2>
            <div className="space-y-2">
              {[
                { method: 'GET', route: '/api/blogs', desc: 'List blogs (supports status, category, pagination filters)' },
                { method: 'POST', route: '/api/blogs', desc: 'Create new blog post' },
                { method: 'GET', route: '/api/blogs/[slug]', desc: 'Get single post by slug' },
                { method: 'PUT', route: '/api/blogs/[id]', desc: 'Update post content or status' },
                { method: 'DELETE', route: '/api/blogs/[id]', desc: 'Delete post (admin only)' },
                { method: 'GET', route: '/api/categories', desc: 'List all categories' },
                { method: 'POST', route: '/api/categories', desc: 'Create category' },
              ].map((item) => (
                <div key={item.route} className="flex items-start gap-3 rounded-lg bg-black/40 px-4 py-3">
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-xs font-medium ${item.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300' : item.method === 'POST' ? 'bg-blue-500/20 text-blue-300' : item.method === 'PUT' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                    {item.method}
                  </span>
                  <code className="text-xs text-gray-300">{item.route}</code>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Your content. Your database. No CMS subscription.</h2>
            <p className="mb-6 text-gray-400">Kostra's blog system is one of 50+ built-in features — get the complete stack.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
