import { siteConfig } from '@/app/siteConfig';
import {
  File,
  FileText,
  Home,
  ListChecks,
  Mail,
  MessageSquare,
  Package,
  Send,
  Users,
  type LucideIcon
} from 'lucide-react';
import { ADMIN, USER, UserRole } from '../routes/types';

/**
 * Navigation item interface for role-based access control
 */
export interface NavigationItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  roles?: readonly UserRole[];
  isActive?: boolean;
  items?: readonly Array<{
    title: string;
    url: string;
  }>;
}

/**
 * Navigation section interface
 */
export interface NavigationSection {
  label: string;
  type: 'collapsible' | 'link';
  hideWhenIcon?: boolean;
  items: NavigationItem[];
}

/**
 * Role-based navigation configuration
 * Each navigation item specifies which roles can access it
 */
export const NAVIGATION_ITEMS: NavigationSection[] = [
  /* {
    label: "Platform",
    type: "collapsible",
    items: [
      {
        title: "Playground",
        icon: TerminalSquare,
        isActive: true,
        items: [
          { title: "History", url: "#" },
          { title: "Starred", url: "#" },
          { title: "Settings", url: "#" },
        ],
      },
    ],
  }, */
  {
    label: "Main",
    type: "link",
    items: [
      {
        title: "Home",
        url: siteConfig.baseLinks.home,
        icon: Home,
        roles: [USER, ADMIN],
      },
      {
        title: "Files",
        url: siteConfig.baseLinks.files,
        icon: File,
        roles: [ADMIN],
      },
    ],
  },
  {
    label: "Admin",
    type: "link",
    items: [
      {
        title: "Packages",
        url: siteConfig.baseLinks.packages,
        icon: Package,
        roles: [ADMIN],
      },
      {
        title: "Blogs",
        url: siteConfig.baseLinks.blogs,
        icon: FileText,
        roles: [ADMIN],
      },
      {
        title: "Categories",
        url: siteConfig.baseLinks.categories,
        icon: ListChecks,
        roles: [ADMIN],
      },
      {
        title: "Email Templates",
        url: '/app/email-templates',
        icon: Mail,
        roles: [ADMIN],
      },
      {
        title: "Email Campaigns",
        url: '/app/email-campaigns',
        icon: Send,
        roles: [ADMIN],
      },
      {
        title: "Users",
        url: siteConfig.baseLinks.admin.users,
        icon: Users,
        roles: [ADMIN],
      },
      {
        title: "Contact Management",
        url: '/app/contact-management',
        icon: MessageSquare,
        roles: [ADMIN],
      },
    ],
  },
];
