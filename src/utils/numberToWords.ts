// Number-to-Words utility supporting numbers up to 1000+

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

export const DIGIT_WORDS: Record<number, string> = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
};

/**
 * Converts a positive integer into words.
 * Examples:
 * 1 -> "one"
 * 7 -> "seven"
 * 13 -> "thirteen"
 * 22 -> "twenty-two"
 * 69 -> "sixty-nine"
 * 100 -> "one hundred"
 * 105 -> "one hundred and five"
 * 250 -> "two hundred and fifty"
 * 1000 -> "one thousand"
 */
export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return `minus ${numberToWords(Math.abs(num))}`;

  if (num < 20) {
    return ONES[num];
  }

  if (num < 100) {
    const ten = Math.floor(num / 10);
    const rest = num % 10;
    return rest > 0 ? `${TENS[ten]}-${ONES[rest]}` : TENS[ten];
  }

  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rest = num % 100;
    const hundredStr = `${ONES[hundreds]} hundred`;
    return rest > 0 ? `${hundredStr} and ${numberToWords(rest)}` : hundredStr;
  }

  if (num === 1000) {
    return 'one thousand';
  }

  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;
  const thousandsStr = `${numberToWords(thousands)} thousand`;
  if (remainder === 0) return thousandsStr;
  if (remainder < 100) return `${thousandsStr} and ${numberToWords(remainder)}`;
  return `${thousandsStr}, ${numberToWords(remainder)}`;
}
