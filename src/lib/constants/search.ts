export type SearchMode = 'smart-search' | 'smart-qa';

export interface SearchModeOption {
  value: SearchMode;
  label: string;
}

export const SEARCH_MODE_OPTIONS: SearchModeOption[] = [
  { value: 'smart-search', label: 'Smart Search' },
  { value: 'smart-qa', label: 'Smart Q&A' },
];
