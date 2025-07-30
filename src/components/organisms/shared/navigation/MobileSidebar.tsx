import {
  RiChat1Line,
  RiDatabase2Line,
  RiFileLine,
  RiLinkM,
  RiMenuLine,
  RiSearchLine,
  RiUserLine,
} from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@/components/atom/Button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/molecules/common/Drawer';
import { cx, focusRing } from '@/lib/utils';

const navigation = [
  { name: 'Search', href: siteConfig.baseLinks.home, icon: RiSearchLine },
  { name: 'Chat', href: '/app/chat', icon: RiChat1Line },
  { name: 'Personas', href: '/app/personas', icon: RiUserLine },
  { name: 'Knowledge Bases', href: '/app/knowledge-bases', icon: RiDatabase2Line },
  { name: 'Files', href: '/app/files', icon: RiFileLine },
] as const;

const shortcuts = [
  {
    name: 'Add new user',
    href: '/settings/users',
    icon: RiLinkM,
  },
] as const;

export default function MobileSidebar() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label="open sidebar"
          className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10"
        >
          <RiMenuLine className="size-6 shrink-0 sm:size-5" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Retail Analytics</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav
            aria-label="core mobile navigation links"
            className="flex flex-1 flex-col space-y-10"
          >
            <ul role="list" className="space-y-1.5">
              {navigation.map(item => (
                <li key={item.name}>
                  <DrawerClose asChild>
                    <Link
                      href={item.href}
                      className={cx(
                        isActive(item.href)
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50',
                        'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-base font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900',
                        focusRing
                      )}
                    >
                      <item.icon className="size-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
            <div>
              <span className="text-sm font-medium leading-6 text-gray-500 sm:text-xs">
                Shortcuts
              </span>
              <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                {shortcuts.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cx(
                        pathname === item.href || pathname.includes(item.href)
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50',
                        'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900',
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
