import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'File Management | Kostra Next.js Boilerplate',
  description:
    'End-to-end file lifecycle management in Kostra — upload, organise, preview, share, and delete files backed by cloud object storage (S3 or Cloudflare R2).',
  keywords:
    'file management Next.js, cloud file storage, S3 file upload, file organisation SaaS, file sharing boilerplate',
  openGraph: {
    title: 'File Management | Kostra Next.js Boilerplate',
    description:
      'Upload, organise, preview, share, and delete files — end-to-end file management backed by S3 or Cloudflare R2.',
    type: 'article',
    url: 'https://kostra.io/features/file-management',
  },
  alternates: { canonical: 'https://kostra.io/features/file-management' },
  robots: { index: true, follow: true },
};

export default function FileManagementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'File Management in Kostra',
            description:
              'How Kostra handles end-to-end file lifecycle with S3/R2 cloud storage.',
            url: 'https://kostra.io/features/file-management',
            isPartOf: { '@type': 'WebSite', name: 'Kostra', url: 'https://kostra.io' },
          }),
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/3 top-0 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
            <span>/</span>
            <span className="text-gray-300">File Management</span>
          </nav>

          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
              Storage
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
              File{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
              Kostra handles the complete file lifecycle — from drag-and-drop upload to
              secure access and deletion — backed by cloud object storage. No external
              file management service required.
            </p>
          </div>

          {/* Lifecycle */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">File lifecycle</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '1', icon: '⬆️', label: 'Upload', desc: 'Drag-and-drop or click to select. Direct upload to S3/R2 via pre-signed URL.' },
                { step: '2', icon: '📁', label: 'Organise', desc: 'Files are scoped per user and browsable in the /app/files dashboard.' },
                { step: '3', icon: '👁️', label: 'Access', desc: 'Secure pre-signed GET URLs for preview and download — files are never public by default.' },
                { step: '4', icon: '🗑️', label: 'Delete', desc: 'Soft delete marks file inactive in the DB; hard delete removes from object storage.' },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <div className="mb-2 text-3xl">{item.icon}</div>
                  <div className="mb-1 text-sm font-medium text-white">{item.label}</div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-light text-white">Capabilities</h2>
            <ul className="space-y-4">
              {[
                'Multi-file upload with per-file progress bars using XHR progress events',
                'File type and size validation on client and server before upload',
                'S3-compatible — works with AWS S3, Cloudflare R2, MinIO, and Backblaze B2',
                'File metadata (name, size, mimeType, key, userId) stored in PostgreSQL',
                'Paginated file browser with search and sort at /app/files',
                'useFiles.ts and useFileUpload.ts hooks for data fetching and upload state',
                'Admin can view all user files from the admin dashboard',
                'Pre-signed URL expiry configurable via FILE_URL_EXPIRY_SECONDS env var',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 text-cyan-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-950/40 to-black p-8 text-center">
            <h2 className="mb-2 text-xl font-medium text-white">Storage sorted. Ship your product.</h2>
            <p className="mb-6 text-gray-400">File management is built into Kostra's complete SaaS stack — get auth, billing, email, and more.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
              Get Kostra →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
