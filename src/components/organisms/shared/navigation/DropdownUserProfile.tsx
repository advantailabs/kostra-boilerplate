'use client';

import { useStripe } from '@/hooks/useStripe';
import { useClerk, useUser } from '@clerk/nextjs';
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
import { useRouter } from 'next/navigation';
import * as React from 'react';

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

export type DropdownUserProfileProps = {
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
};

export function DropdownUserProfile({ children, align = 'start' }: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  useRouter();
  const { openBillingPortal, isCreatingPortal } = useStripe();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>{user?.primaryEmailAddress?.emailAddress}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button
              type="button"
              className="flex w-full items-center gap-2 disabled:opacity-60"
              disabled={isCreatingPortal}
              onClick={openBillingPortal}
            >
              <RiBillLine className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
              Billing
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/app/credit-history" className="flex w-full items-center gap-2">
              <RiCoinLine className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
              Credit history
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSubMenu>
            <DropdownMenuSubMenuTrigger>
              <span className="flex items-center gap-2">
                <RiSunLine className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
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
          <DropdownMenuItem onClick={() => signOut()}>
            <span className="flex items-center gap-2">
              <RiLogoutBoxRLine className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
              Sign out
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
