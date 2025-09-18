/**
 * Reusable User Profile Picture component
 * Displays user profile picture or initials fallback
 */

import { cx } from '@/lib/utils';
import { UserProfilePictureProps } from '@/types/user';
import Image from 'next/image';

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-base',
  xl: 'size-20 text-lg',
};

const sizeDimensions = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export function UserProfilePicture({ user, size = 'md', className }: UserProfilePictureProps) {
  const { name, profilePicture } = user;
  const initials = name.charAt(0).toUpperCase();

  if (profilePicture) {
    return (
      <Image
        src={profilePicture}
        alt={name}
        width={sizeDimensions[size]}
        height={sizeDimensions[size]}
        className={cx(
          'rounded-full border border-gray-300 object-cover dark:border-gray-800',
          sizeClasses[size],
          className
        )}
        unoptimized={profilePicture.startsWith('http')} // Allow external images
      />
    );
  }

  return (
    <div
      className={cx(
        'flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
