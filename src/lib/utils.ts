// Tremor Raw cx [v0.0.0]

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { StoredCitation } from '@/types/chat';

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Process content by replacing citation text with links or removing them
 */
export function processContentWithCitations(
  content: string,
  citations: StoredCitation[],
  replaceWithLinks: boolean = false
): string {
  if (!citations || citations.length === 0) {
    return content;
  }

  // Sort citations by start index in descending order to avoid index shifting
  const sortedCitations = [...citations].sort((a, b) => b.startIndex - a.startIndex);

  let processedContent = content;

  for (const citation of sortedCitations) {
    const { startIndex, endIndex, originalName } = citation;

    if (replaceWithLinks) {
      // Replace citation text with a clickable link
      const linkText = `[${originalName}]`;
      processedContent =
        processedContent.slice(0, startIndex) + linkText + processedContent.slice(endIndex);
    } else {
      // Remove citation text completely
      processedContent = processedContent.slice(0, startIndex) + processedContent.slice(endIndex);
    }
  }

  return processedContent;
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  'focus:ring-2',
  // ring color
  'focus:ring-indigo-200 focus:dark:ring-indigo-700/30',
  // border color
  'focus:border-indigo-500 focus:dark:border-indigo-700',
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-indigo-500 dark:outline-indigo-500',
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30',
];

// Number formatter function

export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat('us', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? '+' : '';

  return `${symbol}${formattedNumber}`;
};

export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};
export const formatters: { [key: string]: any } = {
  currency: (number: number, currency: string = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(number),
  unit: (number: number) => `${usNumberformatter(number)}`,
};
