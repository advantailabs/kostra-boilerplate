import { type ClassValue, clsx } from 'clsx';
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
  'focus:ring-2',
  // ring color
  'focus:ring-indigo-200 focus:dark:ring-indigo-700/30',
  // border color
  'focus:border-indigo-500 focus:dark:border-indigo-700',
];

/**
 * Focus ring styles for interactive elements
 */
export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-indigo-500 dark:outline-indigo-500',
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
