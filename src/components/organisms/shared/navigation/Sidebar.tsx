'use client';

import {
  RiChat1Line,
  RiDatabase2Line,
  RiFileLine,
  RiSearchLine,
  RiUserLine,
  RiVipCrownLine,
} from '@remixicon/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@/components/atom/Button';
import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { cx, focusRing } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useUiModalsStore } from '@/store/ui/modals';

import MobileSidebar from './MobileSidebar';
import { UserProfileDesktop, UserProfileMobile } from './UserProfile';

const navigation = [
  { name: 'Search', href: siteConfig.baseLinks.home, icon: RiSearchLine, section: 'Search' },
  { name: 'Chat', href: '/app/chat', icon: RiChat1Line, section: 'Persona' },
  { name: 'Personas', href: '/app/personas', icon: RiUserLine, section: 'Persona' },
  {
    name: 'Knowledge Bases',
    href: '/app/knowledge-bases',
    icon: RiDatabase2Line,
    section: 'Knowledge',
  },
  { name: 'Files', href: '/app/files', icon: RiFileLine, section: 'Knowledge' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const openCreditPurchase = useUiModalsStore(state => state.openCreditPurchase);
  const handleOpenPurchase = useCallback(() => openCreditPurchase(), [openCreditPurchase]);
  const userPlan = useAuthStore(state => state.user?.plan);

  const isActive = (itemHref: string) => {
    // Exact match for home route to avoid highlighting when on sub-routes
    if (itemHref === siteConfig.baseLinks.home) {
      return pathname === itemHref;
    }
    // For other routes, check if pathname matches or starts with the href
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  const currentTheme = resolvedTheme || theme;
  const logoSrc = currentTheme === 'dark' ? '/logos/light-logo.svg' : '/logos/dark-logo.svg';
  return (
    <>
      {/* sidebar (lg+) */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        <aside className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex h-8 items-center px-2">
            <Image src={logoSrc} alt="Peon Logo" width={120} height={32} className="h-8 w-auto" />
          </div>
          <nav aria-label="core navigation links" className="flex flex-1 flex-col space-y-4">
            {/* Search Section */}
            <div>
              <span className="text-xs font-medium leading-6 text-gray-500">Search</span>
              <ul role="list" className="space-y-0.5">
                {navigation
                  .filter(item => item.section === 'Search')
                  .map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50',
                          'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900',
                          focusRing
                        )}
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden="true" />
                        Find and search
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Persona Section */}
            <div>
              <span className="text-xs font-medium leading-6 text-gray-500">Persona</span>
              <ul role="list" className="space-y-0.5">
                {navigation
                  .filter(item => item.section === 'Persona')
                  .map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50',
                          'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900',
                          focusRing
                        )}
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Knowledge Section */}
            <div>
              <span className="text-xs font-medium leading-6 text-gray-500">Knowledge</span>
              <ul role="list" className="space-y-0.5">
                {navigation
                  .filter(item => item.section === 'Knowledge')
                  .map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50',
                          'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900',
                          focusRing
                        )}
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </nav>
          <div className="mt-auto">
            {/* Credits + Purchase CTA pinned at bottom, above profile (no container background) */}
            <div className="mb-2 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5 dark:border-gray-800">
              <CreditDisplay size="sm" />
              {userPlan === 'PRO' ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <RiVipCrownLine className="size-3.5" /> Pro User
                </span>
              ) : (
                <Button
                  variant="secondary"
                  className="btn-shimmer h-7 px-2 text-xs shadow-sm"
                  onClick={handleOpenPurchase}
                >
                  Purchase
                </Button>
              )}
            </div>
            <UserProfileDesktop />
          </div>
        </aside>
      </nav>
      {/* top navbar (xs-lg) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-8 items-center">
          <Image src={logoSrc} alt="Peon Logo" width={120} height={32} className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  );
}
