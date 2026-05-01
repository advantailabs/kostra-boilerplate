import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'File Management System | Kostra Next.js Boilerplate',
  description:
    'Kostra includes a complete file management system with S3/R2-compatible storage, pre-signed URL uploads, drag-and-drop interface, progress tracking, and per-user file organisation.',
  keywords:
    'file management Next.js, S3 file upload, Cloudflare R2, pre-signed URL upload, drag drop file upload, SaaS file management boilerplate',
  openGraph: {
    title: 'File Management System | Kostra Next.js Boilerplate',
    description:
      'S3/R2 storage, pre-signed URL uploads, drag-and-drop UI, and per-user file organisation — file management built into Kostra.',
    type: 'article',
    url: 'https://kostra.io/features/file-management-system',
  },
  alternates: { canonical: 'https://kostra.io/features/file-management-system' },
  robots: { index: true, follow: true },
};

export default function FileManagementSystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'File Management System in Kostra',
            description:
              'How Kostra implements S3/R2 file storage with pre-signed uploads, drag-and-drop UI, and file organisation.',
            url: 'https://kostra.io/features/file-management-system',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">File Management System</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
              Storage
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              File Management{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              A complete file lifecycle from upload to deletion — with S3-compatible storage
              (AWS S3 or Cloudflare R2), secure pre-signed URLs, drag-and-drop UI, and
              per-user file organisation tracked in PostgreSQL.
            </p>
          </div>

          {/* Upload architecture */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Upload architecture</h2>
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Client requests pre-signed URL',
                  description:
                    'The browser calls POST /api/file-upload/presigned-url with the file name, size, and content type. The server generates a short-lived pre-signed PUT URL directly to S3/R2.',
                },
                {
                  step: '02',
                  title: 'Direct-to-storage upload',
                  description:
                    'The client uploads the file directly to S3/R2 using the pre-signed URL — bypassing your Next.js server. This keeps bandwidth costs low and upload speeds fast.',
                },
                {
                  step: '03',
                  title: 'Server confirms and records',
                  description:
                    'After upload completes, the client notifies POST /api/files to create a File record in Prisma: name, size, mimeType, key, userId, and createdAt.',
                },
                {
                  step: '04',
                  title: 'Pre-signed download URLs',
                  description:
                    'File access is gated behind pre-signed GET URLs generated on demand — files are never publicly accessible by default.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="shrink-0 font-mono text-2xl font-light text-gray-600">{item.step}</span>
                  <div>
                    <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features list */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">What's included</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '🖱️', title: 'Drag-and-drop UI', desc: 'Drop zone with multi-file selection, file type filtering, and upload queue.' },
                { icon: '📊', title: 'Upload progress', desc: 'Real-time progress bar per file using XMLHttpRequest progress events.' },
                { icon: '🔍', title: 'File browser', desc: 'Paginated file list with search, sort, and filter by type — at /app/files.' },
                { icon: '🔒', title: 'Access control', desc: 'Files are scoped to the authenticated user — admins can view all files.' },
                { icon: '🗑️', title: 'Soft and hard delete', desc: 'Mark files as deleted in the DB and optionally remove from object storage.' },
                { icon: '☁️', title: 'S3 and R2 support', desc: 'Switch between AWS S3 and Cloudflare R2 via a single STORAGE_PROVIDER env var.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech stack */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-lg font-medium text-white">Implementation stack</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Storage backend', value: 'AWS S3 / Cloudflare R2' },
                { label: 'SDK', value: '@aws-sdk/client-s3' },
                { label: 'Upload method', value: 'Pre-signed PUT URLs' },
                { label: 'File metadata', value: 'PostgreSQL via Prisma' },
                { label: 'Hook', value: 'useFileUpload.ts' },
                { label: 'API routes', value: '/api/file-upload, /api/files' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Files — handled. Ship the rest.</h2>
            <p className="mb-6 text-gray-400">
              Kostra includes file management alongside auth, billing, blog, and email — complete SaaS stack in one purchase.
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
