import { Button } from '@/components/atom/Button';
import { S3_PUBLIC_BASE_URL } from '@/lib/s3';
import { BlogResponseType } from '@/types/blog.type';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface BlogCardProps {
  blog: BlogResponseType;
  onEdit?: (_blog: BlogResponseType) => void;
  onDelete?: (_blog: BlogResponseType) => void;
  className?: string;
  onClick?: (_blog: BlogResponseType) => void;
}

export function BlogCard({ blog, onEdit, onDelete, className, onClick }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);

  // Get the full image URL
  const getImageUrl = () => {
    if (!blog.blogImageUrl) return null;
    if (blog.blogImageUrl.startsWith('http')) return blog.blogImageUrl;
    return `${S3_PUBLIC_BASE_URL}/${blog.blogImageUrl}`;
  };

  const imageUrl = getImageUrl();

  // Generate a gradient background based on blog title for fallback
  const getGradientBackground = (title: string) => {
    const colors = [
      'from-blue-600 to-purple-600',
      'from-purple-600 to-pink-600',
      'from-pink-600 to-red-600',
      'from-red-600 to-orange-600',
      'from-orange-600 to-yellow-600',
      'from-yellow-600 to-green-600',
      'from-green-600 to-teal-600',
      'from-teal-600 to-cyan-600',
      'from-cyan-600 to-blue-600',
    ];

    // Simple hash function without bitwise operations
    let hash = 0;
    for (let i = 0; i < title.length; i += 1) {
      const char = title.charCodeAt(i);
      hash = (hash * 31 + char) % 2147483647; // Use multiplication instead of bitwise
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const gradientClass = getGradientBackground(blog.title);

  const handleClick = () => {
    onClick?.(blog);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(blog);
    }
  };

  return (
    <div
      className={`group relative h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-gray-900/40 ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Blog: ${blog.title}`}
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradientClass}`} />
        )}

        {/* Bottom gradient overlay for text readability on light images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent" />
      </div>

      {/* Published Status - Top Left */}
      <div className="absolute left-2 top-2">
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-medium backdrop-blur-sm ${
            blog.published ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500 text-black'
          }`}
        >
          {blog.published ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 flex gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              onEdit(blog);
            }}
            className="h-6 w-6 bg-white/20 p-0 text-white backdrop-blur-sm hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30"
          >
            <Edit className="h-3 w-3" aria-label="Edit blog" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              onDelete(blog);
            }}
            className="h-6 w-6 bg-red-500/20 p-0 text-white backdrop-blur-sm hover:bg-red-500/30 dark:bg-red-600/20 dark:hover:bg-red-600/30"
          >
            <Trash2 className="h-3 w-3" aria-label="Delete blog" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
        {/* Title and Tags */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-tight group-hover:text-white/90">
            {blog.title}
          </h3>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-shrink-0 flex-wrap gap-1">
              {blog.tags.slice(0, 1).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/20 px-1 py-0.5 text-xs font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 1 && (
                <span className="rounded-full bg-white/20 px-1 py-0.5 text-xs font-medium backdrop-blur-sm">
                  +{blog.tags.length - 1}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="font-medium">{blog.author?.name || 'Unknown Author'}</span>
          <span className="text-white/70">{formatDate(blog.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
