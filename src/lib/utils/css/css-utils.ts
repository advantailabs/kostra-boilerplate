import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for composing Tailwind CSS classes
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Form input focus styles
 */
export const focusInput = [
  // base
  'focus:ring-2 focus:border-0 focus:dark:border-0',
  // ring color
  'focus:ring-primary focus:dark:ring-primary',
  // border color
  'focus:border-primary focus:dark:border-primary',
];

/**
 * Focus ring styles for interactive elements
 */
export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-primary dark:outline-primary',
];

/**
 * Error state styles for form inputs
 */
export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30',
];
