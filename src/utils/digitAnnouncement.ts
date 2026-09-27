import { DIGIT_WORDS, numberToWords } from './numberToWords';

/**
 * Builds the phonetic digit breakdown for any positive integer.
 * Examples:
 * 7   -> "Single digit, seven."
 * 22  -> "Double digit, two two, twenty-two."
 * 69  -> "Double digit, six nine, sixty-nine."
 * 105 -> "Triple digit, one zero five, one hundred and five."
 * 250 -> "Triple digit, two five zero, two hundred and fifty."
 */
export function buildDigitAnnouncement(num: number): string {
  const words = numberToWords(num);
  const digitsStr = String(num);

  if (digitsStr.length === 1) {
    const digitWord = DIGIT_WORDS[num] || words;
    return `Single digit, ${digitWord}.`;
  }

  const individualDigits = digitsStr
    .split('')
    .map((d) => DIGIT_WORDS[parseInt(d, 10)] || d)
    .join(' ');

  if (digitsStr.length === 2) {
    return `Double digit, ${individualDigits}, ${words}.`;
  }

  if (digitsStr.length === 3) {
    return `Triple digit, ${individualDigits}, ${words}.`;
  }

  // 4+ digits fallback
  return `${digitsStr.length} digits, ${individualDigits}, ${words}.`;
}
