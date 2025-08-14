/**
 * Credit system constants
 */

export const CREDIT_COSTS = {
  CHAT: 1.0,
  SMART_SEARCH: 0.5,
  SMART_QA: 2.0,
} as const;

export const DEFAULT_INITIAL_CREDITS = 100.0;

export const CREDIT_OPERATIONS = {
  CHAT: 'CHAT',
  SMART_SEARCH: 'SMART_SEARCH',
  SMART_QA: 'SMART_QA',
  INITIAL_CREDITS: 'INITIAL_CREDITS',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
} as const;

export const CREDIT_TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export type CreditOperation = (typeof CREDIT_OPERATIONS)[keyof typeof CREDIT_OPERATIONS];
export type CreditTransactionType =
  (typeof CREDIT_TRANSACTION_TYPES)[keyof typeof CREDIT_TRANSACTION_TYPES];
