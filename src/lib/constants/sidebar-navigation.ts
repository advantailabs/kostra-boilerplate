import { siteConfig } from '@/app/siteConfig';
import {
  RiArticleLine,
  RiFileLine,
  RiHomeLine,
  RiListCheck,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react';
import { ADMIN, USER, UserRole } from '../routes/types';

/**
 * Navigation item interface for role-based access control
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: any; // Icon component type
  section: string;
  roles: UserRole[]; // Roles that can access this navigation item
}

/**
 * Role-based navigation configuration
 * Each navigation item specifies which roles can access it
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Persona section - accessible to both USER and ADMIN
  {
    name: 'Home',
    href: siteConfig.baseLinks.home,
    section: 'Persona',
    roles: [USER, ADMIN],
    icon: RiHomeLine,
  },
  {
    name: 'Personas',
    href: siteConfig.baseLinks.personas,
    section: 'Persona',
    roles: [USER, ADMIN],
    icon: RiUserLine,
  },
  {
    name: 'Files',
    href: siteConfig.baseLinks.files,
    section: 'Persona',
    roles: [USER, ADMIN],
    icon: RiFileLine,
  },

  // Admin section - accessible only to ADMIN
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
] as const;
