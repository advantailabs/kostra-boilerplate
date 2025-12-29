import { getAllBlogs } from '@/services/repositories/blogs';
import { format } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Enable ISR - regenerate page every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog - Kostra',
  description: 'Read our latest blog posts about Next.js, development, and best practices.',
  openGraph: {
    title: 'Blog - Kostra',
    description: 'Read our latest blog posts about Next.js, development, and best practices.',
    type: 'website',
  },
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

type BlogCategory = {
   
  category: {
    id: number;
    name: string;
  };
};

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  content: string;
  blogImageUrl: string | null;
  createdAt: Date;
  categories: BlogCategory[];
  author: {
    id: number;
    name: string;
  };
};

export default async function BlogListPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const result = await getAllBlogs({
    published: true,
    limit: 12,
    page: currentPage,
  });

  if (!result || !result.data) {
    notFound();
  }

  const blogs = result.data;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-white/5 bg-black/80 border-b backdrop-blur-md">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">Blog</h1>
          <p className="mt-4 text-lg text-white sm:text-xl">
            Latest articles, tutorials, and insights
          </p>
        </div>
      </div>

      {/* Blog List */}
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        {blogs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-400">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: BlogItem) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 group block rounded-lg border p-6 transition-all"
              >
                {blog.blogImageUrl && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={blog.blogImageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="mb-2 flex flex-wrap gap-2">
                  {blog.categories.map(({ category }: BlogCategory) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-primary">
                  {blog.title}
                </h2>
                <p className="mb-4 line-clamp-3 text-sm text-white">
                  {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-xs text-white">
                  <span>{blog.author.name}</span>
                  <time dateTime={blog.createdAt.toISOString()}>
                    {format(blog.createdAt, 'MMM d, yyyy')}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {result.pagination && result.pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {result.pagination.hasPreviousPage && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 rounded-lg border px-4 py-2 text-sm text-white transition-colors"
              >
                Previous
              </Link>
            )}
            {Array.from(
              { length: result.pagination.totalPages },
              (_: unknown, i: number) => i + 1
            ).map((pageNum: number) => (
              <Link
                key={pageNum}
                href={`/blog?page=${pageNum}`}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  pageNum === currentPage
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-white'
                }`}
              >
                {pageNum}
              </Link>
            ))}
            {result.pagination.hasNextPage && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 rounded-lg border px-4 py-2 text-sm text-white transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
