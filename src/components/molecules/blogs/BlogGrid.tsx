import { Button } from '@/components/ui/button';
import { BlogResponseType } from '@/types/blog.type';
import { Plus, Search } from 'lucide-react';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  searchInput: string;
  blogs: BlogResponseType[];
  onEdit?: (blog: BlogResponseType) => void;
  onDelete?: (blog: BlogResponseType) => void;
  onAdd?: () => void;
  onBlogClick?: (blog: BlogResponseType) => void;
  className?: string;
}

export function BlogGrid({
  searchInput,
  blogs,
  onEdit,
  onDelete,
  onAdd,
  onBlogClick,
  className,
}: BlogGridProps) {
  if (blogs.length === 0 && searchInput.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-background-light">
            <Plus className="h-12 w-12 text-text-muted" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text">No blogs yet</h3>
          <p className="mb-6 text-sm text-text-muted">
            Get started by creating your first blog post
          </p>
          {onAdd && (
            <Button onClick={onAdd} className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Blog
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (blogs.length === 0 && searchInput.length > 0) {
    return <div className={`flex h-[calc(100%-4rem)] flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-background-light">
          <Search className="h-12 w-12 text-text-muted" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text">No Blogs Found</h3>
        <p className="mb-6 text-sm text-text-muted">
          No results found for your search. Try searching for a different title.
        </p>
      </div>
    </div>
  }
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Button */}
      {onAdd && (
        <div className="flex justify-end">
          <Button onClick={onAdd} className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogs.map(blog => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={onBlogClick}
          />
        ))}
      </div>
    </div>
  );
}
