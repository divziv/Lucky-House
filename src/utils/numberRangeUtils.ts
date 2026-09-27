export interface NumberRange {
  start: number;
  end: number;
}

export const MAX_NUMBER = 1000;
export const MIN_NUMBER = 1;

export interface NumberRangeValidation {
  valid: boolean;
  error?: string;
  count: number;
}

/**
 * Validates a number range according to game constraints
 */
export function validateNumberRange(start: number, end: number): NumberRangeValidation {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { valid: false, error: 'Start and end must be whole integers.', count: 0 };
  }

  if (start < MIN_NUMBER) {
    return { valid: false, error: `Starting number cannot be less than ${MIN_NUMBER}.`, count: 0 };
  }

  if (end > MAX_NUMBER) {
    return { valid: false, error: `Last number cannot exceed ${MAX_NUMBER}.`, count: 0 };
  }

  if (start >= end) {
    return { valid: false, error: 'Starting number must be strictly less than the last number.', count: 0 };
  }

  const count = end - start + 1;
  if (count < 15) {
    return { valid: false, error: 'The range must include at least 15 numbers to support Tambola tickets.', count };
  }

  return { valid: true, count };
}

/**
 * Generates an ordered numerical array [start, start + 1, ..., end]
 * Used STRICTLY for the visual Tambola board.
 */
export function generateOrderedNumberBoard(start: number, end: number): number[] {
  const result: number[] = [];
  for (let n = start; n <= end; n++) {
    result.push(n);
  }
  return result;
}

/**
 * Creates and shuffles a separate calling pool containing every number in the range once.
 * The calling sequence is random, while the visual board remains ordered.
 */
export function createShuffledCallingPool(start: number, end: number): number[] {
  const pool = generateOrderedNumberBoard(start, end);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
