import { siteConfig } from '@/app/siteConfig';
import {
  RemixiconComponentType,
  RiArticleLine,
  RiCustomerService2Line,
  RiFileLine,
  RiHomeLine,
  RiListCheck,
  RiShoppingBagLine,
  RiTeamLine,
} from '@remixicon/react';
import { ADMIN, USER, UserRole } from '../routes/types';

/**
 * Navigation item interface for role-based access control
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: RemixiconComponentType; // Icon component type
  section: string;
  roles: UserRole[]; // Roles that can access this navigation item
}

/**
 * Role-based navigation configuration
 * Each navigation item specifies which roles can access it
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Main section - accessible to both USER and ADMIN
  {
    name: 'Home',
    href: siteConfig.baseLinks.home,
    section: 'Main',
    roles: [USER, ADMIN],
    icon: RiHomeLine,
  },
  {
    name: 'Files',
    href: siteConfig.baseLinks.files,
    section: 'Main',
    roles: [USER, ADMIN],
    icon: RiFileLine,
  },

  // Admin section - accessible only to ADMIN
  {
    name: 'Packages',
    href: siteConfig.baseLinks.packages,
    section: 'Admin',
    roles: [ADMIN],
    icon: RiShoppingBagLine,
  },
  {
    name: 'Blogs',
    href: siteConfig.baseLinks.blogs,
    section: 'Admin',
    roles: [ADMIN],
    icon: RiArticleLine,
  },
  {
    name: 'Categories',
    href: siteConfig.baseLinks.categories,
    section: 'Admin',
    roles: [ADMIN],
    icon: RiListCheck,
  },
  {
    name: 'Users',
    href: siteConfig.baseLinks.admin.users,
    section: 'Admin',
    roles: [ADMIN],
    icon: RiTeamLine,
  },
  {
    name: 'Contact Management',
    href: '/app/contact-management',
    icon: RiCustomerService2Line,
    section: 'Admin',
    roles: [ADMIN],
  },
] as const;
