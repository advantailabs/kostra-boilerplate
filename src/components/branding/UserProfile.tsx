'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function UserProfile() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const clerk = useClerk();

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

  const handleSignOutClick = () => {
    clerk.signOut();
    setIsOpen(false);
  };

  return (
    <div className="user-profile-container relative">
      <button
        onClick={toggleMenu}
        className="flex items-center rounded-full ring-2 ring-transparent transition-all hover:ring-gray-200 focus:outline-none focus:ring-blue-200"
      >
        {user?.hasImage ? (
          <Image
            src={user?.imageUrl}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {user?.firstName?.[0] ||
              user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
              '?'}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
          </div>
          <div className="py-1">
            <Link
              href="/app/overview"
              className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <span>Dashboard</span>
            </Link>

            <button
              onClick={handleSignOutClick}
              className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
