/**
 * Navigation icon mapping constants
 * Shared across navigation components to avoid duplication
 */

import {
  RiArticleLine,
  RiFileLine,
  RiHomeLine,
  RiListCheck,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react';

/**
 * Icon mapping for navigation items
 * Maps navigation item names to their corresponding icon components
 */
export const NAVIGATION_ICON_MAP = {
  Home: RiHomeLine,
  Personas: RiUserLine,
  Files: RiFileLine,
  Blogs: RiArticleLine,
  Categories: RiListCheck,
  Users: RiTeamLine,
} as const;

/**
 * Type for navigation item names that have icons
 */
export type NavigationItemName = keyof typeof NAVIGATION_ICON_MAP;
