// Citation types for content processing
export interface StoredCitation {
  startIndex: number;
  endIndex: number;
  originalName: string;
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

/**
 * Format number with US locale
 */
export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat('us', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

/**
 * Format number as percentage
 */
export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? '+' : '';

  return `${symbol}${formattedNumber}`;
};

/**
 * Format number in millions
 */
export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};

/**
 * Common formatters collection
 */
export const formatters: { [key: string]: unknown } = {
  currency: (number: number, currency: string = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(number),
  unit: (number: number) => `${usNumberformatter(number)}`,
};
