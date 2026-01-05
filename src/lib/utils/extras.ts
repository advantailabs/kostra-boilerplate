import { customAlphabet } from 'nanoid';

export function uniqueNumericId() {
  const generateNumericId = customAlphabet('0123456789', 9);
  const id = parseInt(generateNumericId(), 10);
  return id;
}

/**
 * Sleep utility function to delay execution
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}
