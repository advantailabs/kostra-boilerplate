import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { S3_PUBLIC_BASE_URL } from '@/services/external/aws/s3';
import { BlogResponseType } from '@/types/blog.type';
import { ArrowRight, CalendarDays, Edit, Trash2 } from 'lucide-react';
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

// Strip HTML and truncate for excerpt
const getExcerpt = (html: string, maxLength = 120): string => {
  if (!html || typeof html !== 'string') return '';
  const stripped = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength).trim()}…`;
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

    let hash = 0;
    for (let i = 0; i < title.length; i += 1) {
      const char = title.charCodeAt(i);
      hash = (hash * 31 + char) % 2147483647;
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const gradientClass = getGradientBackground(blog.title);
  const categoryLabel =
    blog.categories?.[0]?.category?.name ?? blog.tags?.[0] ?? null;
  const excerpt = getExcerpt(blog.content);

  const isCardClickable = onClick && !onEdit && !onDelete;

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
    <Card
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 overflow-hidden rounded-xl border py-6 shadow-none h-full group transition-all duration-300',
        className
      )}
      onClick={isCardClickable ? handleClick : undefined}
      onKeyDown={isCardClickable ? handleKeyDown : undefined}
      role={isCardClickable ? 'button' : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      aria-label={isCardClickable ? `Blog: ${blog.title}` : undefined}
    >
      <CardContent className="px-6 space-y-3.5">
        {/* Image block */}
        <div className="relative mb-6 overflow-hidden rounded-lg sm:mb-12">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              width={600}
              height={238}
              className="h-[238px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={cn(
                'h-[238px] w-full bg-linear-to-br',
                gradientClass
              )}
            />
          )}
          <div className="absolute left-2 top-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm',
                blog.published
                  ? 'bg-green-600 text-green-200'
                  : 'bg-yellow-500 text-black'
              )}
            >
              {blog.published ? 'Published' : 'Draft'}
            </span>
          </div>
          {(onEdit || onDelete) && (
            <div className="absolute right-2 top-2 flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(blog);
                  }}
                  className="h-7 w-7 bg-gray-800/30 p-0 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
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
                  className="h-7 w-7 bg-red-600/80 p-0 text-white backdrop-blur-sm hover:bg-danger/30 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" aria-label="Delete blog" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Meta row: date + category/tags badge */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="text-muted-foreground flex items-center gap-1.5 text-base">
            <CalendarDays className="size-6 shrink-0" aria-hidden />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {categoryLabel && (
              <Badge className="border-0 rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                {categoryLabel}
              </Badge>
            )}
            {blog.tags && blog.tags.length > 1 && (
              <Badge className="border-0 rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                +{blog.tags.length - 1}
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'line-clamp-2 text-lg font-medium md:text-xl',
            isCardClickable && 'cursor-pointer'
          )}
        >
          {blog.title}
        </h3>

        {/* Description excerpt */}
        {excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-base">{excerpt}</p>
        )}

        {/* Footer: author + read more button */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {blog.author?.name ?? 'Unknown Author'}
          </span>
          {isCardClickable && (
            <Button
              variant="outline"
              size="icon"
              className="size-9 border shadow-xs transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
              onClick={e => {
                e.stopPropagation();
                handleClick();
              }}
              aria-label={`Read more: ${blog.title}`}
            >
              <ArrowRight className="size-4 -rotate-45 shrink-0" aria-hidden />
              <span className="sr-only">Read more: {blog.title}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
