import { getAllBlogs, getBlogBySlug } from '@/services/repositories/blogs';
import { format } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Enable ISR - regenerate page every hour
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  blogImageUrl: string | null;
  createdAt: Date;
};

type BlogCategory = {
   
  category: {
    id: number;
    name: string;
  };
};

// Generate static pages for all blogs at build time
export async function generateStaticParams() {
  try {
    const result = await getAllBlogs({
      published: true,
      limit: 100,
    });

    return (
      result?.data?.map((blog: { slug: string }) => ({
        slug: blog.slug,
      })) || []
    );
  } catch (error) {
    // If database is not available during build, return empty array
    // Pages will be generated on-demand with ISR
    console.warn('Failed to generate static params for blog pages:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog.published) {
    return {
      title: 'Blog Post Not Found - Kostra',
    };
  }

  return {
    title: `${blog.title} - Kostra`,
    description: blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
      type: 'article',
      images: blog.blogImageUrl ? [blog.blogImageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog.published) {
    notFound();
  }

  // Get recent blogs (excluding current one)
  const recentBlogsResult = await getAllBlogs({
    published: true,
    limit: 5,
  });

  const recentBlogs =
    recentBlogsResult?.data
      ?.filter((b: BlogItem) => b.id !== blog.id && b.slug !== slug)
      .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-white/5 bg-black/80 border-b backdrop-blur-md">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <Link
            href="/blog"
            className="mb-4 inline-flex items-center text-sm text-white transition-colors hover:text-primary"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Blog Header */}
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.categories.map(({ category }: BlogCategory) => (
                  <span
                    key={category.id}
                    className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">{blog.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white">
                <span>{blog.author.name}</span>
                <span>•</span>
                <time dateTime={blog.createdAt.toISOString()}>
                  {format(blog.createdAt, 'MMMM d, yyyy')}
                </time>
              </div>
            </header>

            {/* Featured Image */}
            {blog.blogImageUrl && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={blog.blogImageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                />
              </div>
            )}

            {/* Blog Content */}
            <div
              className="prose-pre:bg-white/5 prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:leading-relaxed prose-p:text-white prose-a:text-primary prose-a:no-underline prose-blockquote:border-l-primary prose-blockquote:text-white prose-strong:text-white prose-code:text-white prose-pre:text-white prose-ol:text-white prose-ul:text-white prose-li:text-white hover:prose-a:text-primary-hover"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="border-white/10 mt-8 border-t pt-8">
                <h3 className="mb-4 text-sm font-semibold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/60 px-3 py-1 text-xs text-white"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Recent Blogs */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="mb-6 text-xl font-semibold text-white">Recent Posts</h2>
              {recentBlogs.length > 0 ? (
                <div className="space-y-6">
                  {recentBlogs.map((recentBlog: BlogItem) => (
                    <Link
                      key={recentBlog.id}
                      href={`/blog/${recentBlog.slug}`}
                      className="border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 group block rounded-lg border p-4 transition-all"
                    >
                      {recentBlog.blogImageUrl && (
                        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg">
                          <Image
                            src={recentBlog.blogImageUrl}
                            alt={recentBlog.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        </div>
                      )}
                      <h3 className="mb-2 text-base font-semibold text-white transition-colors group-hover:text-primary">
                        {recentBlog.title}
                      </h3>
                      <time
                        dateTime={recentBlog.createdAt.toISOString()}
                        className="text-xs text-white"
                      >
                        {format(recentBlog.createdAt, 'MMM d, yyyy')}
                      </time>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No recent posts available.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
