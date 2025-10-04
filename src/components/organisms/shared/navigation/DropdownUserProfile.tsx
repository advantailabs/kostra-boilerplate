'use client';

import { useLogout } from '@/hooks/useLogout';
import { useStripe } from '@/hooks/useStripe';
import { googleLogout } from '@react-oauth/google';
import {
  RiBillLine,
  RiCoinLine,
  RiComputerLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiSunLine,
} from '@remixicon/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import * as React from 'react';

import { siteConfig } from '@/app/siteConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export type DropdownUserProfileProps = {
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
};

export function DropdownUserProfile({ children, align = 'start' }: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { openBillingPortal, isCreatingPortal } = useStripe();
  const logoutMutation = useLogout();

  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await logoutMutation.mutateAsync();
      router.push(siteConfig.baseLinks.landing);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side auth state
      googleLogout();
      clearAuth();
      // Redirect to home page
      router.push(siteConfig.baseLinks.landing);
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button
              type="button"
              className="flex w-full items-center gap-2 disabled:opacity-60"
              disabled={isCreatingPortal}
              onClick={openBillingPortal}
            >
              <RiBillLine className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              Billing
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href={siteConfig.baseLinks.creditHistory}
              className="flex w-full items-center gap-2"
            >
              <RiCoinLine className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              Credit history
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSubMenu>
            <DropdownMenuSubMenuTrigger>
              <span className="flex items-center gap-2">
                <RiSunLine className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                Theme
              </span>
            </DropdownMenuSubMenuTrigger>
            <DropdownMenuSubMenuContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={value => {
                  setTheme(value);
                }}
              >
                <DropdownMenuRadioItem
                  aria-label="Switch to Light Mode"
                  value="light"
                  iconType="check"
                >
                  <RiSunLine className="size-4 shrink-0" aria-hidden="true" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  aria-label="Switch to Dark Mode"
                  value="dark"
                  iconType="check"
                >
                  <RiMoonLine className="size-4 shrink-0" aria-hidden="true" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  aria-label="Switch to System Mode"
                  value="system"
                  iconType="check"
                >
                  <RiComputerLine className="size-4 shrink-0" aria-hidden="true" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubMenuContent>
          </DropdownMenuSubMenu>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button type="button" className="flex w-full items-center gap-2" onClick={handleLogout}>
              <RiLogoutBoxRLine className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              Sign out
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
