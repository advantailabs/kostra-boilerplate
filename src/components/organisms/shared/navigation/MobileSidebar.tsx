import { RiCloseLine, RiMenuLine } from '@remixicon/react';
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
import { NAVIGATION_ITEMS } from '@/lib/constants/sidebar-navigation';
import { cx, focusRing } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function MobileSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRole = user?.role;

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
          className="group flex items-center rounded-md p-2 text-sm font-medium data-[state=open]:bg-background-light hover:bg-background-light"
        >
          <RiMenuLine className="size-6 shrink-0 sm:size-5" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-border px-2 py-4">
          <h2 className="px-2 text-lg font-semibold text-text">Menu</h2>
          <DrawerClose asChild>
            <Button variant="ghost" aria-label="close sidebar" className="h-8 w-8 p-0">
              <RiCloseLine className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>
        <DrawerBody>
          <nav aria-label="core mobile navigation links" className="flex flex-1 flex-col space-y-6">
            {/* Main Section */}
            <div>
              <span className="text-sm font-medium leading-6 text-text-muted sm:text-xs">Main</span>
              <ul role="list" className="space-y-1.5">
                {NAVIGATION_ITEMS.filter(
                  item => item.section === 'Main' && item.roles.includes(userRole as any)
                ).map(item => (
                  <li key={item.name}>
                    <DrawerClose asChild>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href) ? 'text-primary' : 'text-text-muted hover:text-text',
                          'flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-base font-medium transition hover:bg-background-light sm:text-sm',
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
            {/* Admin Section */}
            {userRole === 'ADMIN' && (
              <div>
                <span className="text-sm font-medium leading-6 text-text-muted sm:text-xs">
                  Admin
                </span>
                <ul role="list" className="space-y-1.5">
                  {NAVIGATION_ITEMS.filter(
                    item => item.section === 'Admin' && item.roles.includes(userRole as any)
                  ).map(item => (
                    <li key={item.name}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cx(
                            isActive(item.href)
                              ? 'text-primary'
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
            )}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
