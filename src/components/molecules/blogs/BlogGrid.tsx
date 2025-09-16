import { Button } from '@/components/atom/Button';
import { BlogResponseType } from '@/types/blog.type';
import { RiAddLine } from '@remixicon/react';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  blogs: BlogResponseType[];
  onEdit?: (blog: BlogResponseType) => void;
  onDelete?: (blog: BlogResponseType) => void;
  onAdd?: () => void;
  onBlogClick?: (blog: BlogResponseType) => void;
  className?: string;
}

export function BlogGrid({
  blogs,
  onEdit,
  onDelete,
  onAdd,
  onBlogClick,
  className,
}: BlogGridProps) {
  if (blogs.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RiAddLine className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No blogs yet
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first blog post
          </p>
          {onAdd && (
            <Button onClick={onAdd} className="inline-flex items-center">
              <RiAddLine className="mr-2 h-4 w-4" />
              Create Blog
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Button */}
      {onAdd && (
        <div className="flex justify-end">
          <Button onClick={onAdd} className="inline-flex items-center">
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
