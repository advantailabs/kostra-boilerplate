import {
  RiCloseLine,
  RiHomeLine,
  RiMenuLine,
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
  DrawerTrigger,
} from '@/components/molecules/common/Drawer';
import { cx, focusRing } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/app', icon: RiHomeLine, section: 'Persona' },
  { name: 'Personas', href: '/app/personas', icon: RiUserLine, section: 'Persona' },
] as const;

export default function MobileSidebar() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    // Exact match for home route to avoid highlighting when on sub-routes
    if (itemHref === siteConfig.baseLinks.home) {
      return pathname === itemHref;
    }
    // For other routes, check if pathname matches or starts with the href
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
        <div className="flex items-center justify-between border-b border-gray-200 px-2 py-4 dark:border-gray-800">
          <h2 className="px-2 text-lg font-semibold">Menu</h2>
          <DrawerClose asChild>
            <Button variant="ghost" aria-label="close sidebar" className="h-8 w-8 p-0">
              <RiCloseLine className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>
        <DrawerBody>
          <nav aria-label="core mobile navigation links" className="flex flex-1 flex-col space-y-6">
            {/* Persona Section */}
            <div>
              <span className="text-sm font-medium leading-6 text-gray-500 sm:text-xs">
                Persona
              </span>
              <ul role="list" className="space-y-1.5">
                {navigation
                  .filter(item => item.section === 'Persona')
                  .map(item => (
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
            </div>
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
