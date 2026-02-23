import { cx } from '@/lib/utils';
import { S3_PUBLIC_BASE_URL } from '@/services/external/aws/s3';
import Image from 'next/image';
import React from 'react';

interface AvatarProps extends React.ComponentPropsWithoutRef<'div'> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, forwardedRef) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div
        ref={forwardedRef}
        className={cx(
          'relative flex-shrink-0 overflow-hidden rounded-full ring-2 ring-border',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src.startsWith('http') ? src : `${S3_PUBLIC_BASE_URL}/${src}`}
            alt={alt || 'Avatar'}
            fill
            className="object-cover"
            sizes={(() => {
              if (size === 'sm') return '32px';
              if (size === 'md') return '40px';
              return '48px';
            })()}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xs">
            <span className={cx('font-semibold text-white', textSizes[size])}>
              {fallback?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, type AvatarProps };
