'use client';

import { siteConfig } from '@/app/siteConfig';
import { useLogout } from '@/hooks/useLogout';
import { useAuthStore } from '@/store/auth';
import { googleLogout } from '@react-oauth/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function UserProfile() {
  const { user, clearAuth } = useAuthStore();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.user-profile-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOutClick = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push(siteConfig.baseLinks.landing);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      googleLogout();
      clearAuth();
      setIsOpen(false);
    }
  };

  return (
    <div className="user-profile-container relative">
      <button
        onClick={toggleMenu}
        className="flex items-center rounded-full ring-2 ring-transparent transition-all hover:ring-gray-200 focus:outline-hidden focus:ring-blue-200"
      >
        {user?.profilePicture ? (
          <Image
            src={user?.profilePicture}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border-light bg-background-light p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium text-text">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              href={siteConfig.baseLinks.home}
              className="flex items-center rounded-md px-4 py-2 text-sm text-text transition-colors hover:bg-background"
              onClick={() => setIsOpen(false)}
            >
              <span>Dashboard</span>
            </Link>

            <button
              onClick={handleSignOutClick}
              className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-text transition-colors hover:bg-background"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
