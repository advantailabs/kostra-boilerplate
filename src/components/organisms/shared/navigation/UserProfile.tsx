'use client';

import { RiMore2Fill } from '@remixicon/react';
import Image from 'next/image';

import { cx, focusRing } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/atom/Button';
import { DropdownUserProfile } from './DropdownUserProfile';

export function UserProfileDesktop() {
  const { user } = useAuthStore();

  if (!user) return null;

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : '??';
  const fullName = user.name;

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          focusRing,
          'group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10'
        )}
      >
        <span className="flex items-center gap-3">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={fullName}
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          ) : (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
          <span>{fullName}</span>
        </span>
        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  );
}

export function UserProfileMobile() {
  const { user } = useAuthStore();

  if (!user) return null;

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : '??';

  return (
    <DropdownUserProfile align="end">
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          'group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10'
        )}
      >
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt={user.name || ''}
            width={32}
            height={32}
            className="size-7 rounded-full"
          />
        ) : (
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
      </Button>
    </DropdownUserProfile>
  );
}
