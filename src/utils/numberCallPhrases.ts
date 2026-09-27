import { tambolaCalls } from '../data/tambolaCalls';
import { CallingStyle, NumberRange } from '../types/tambola';
import { buildDigitAnnouncement } from './digitAnnouncement';
import { numberToWords } from './numberToWords';

export interface NumberAnnouncement {
  number: number;
  displayText: string;
  subDisplayText: string;
  primaryDescription: string;
  secondaryDescription?: string;
  spokenPhrases: string[];
}

/**
 * Priority of special phrases:
 * 1. Top of the House (dynamically evaluated: number === numberRange.end)
 * 2. Explicitly configured special number phrase (e.g. 1 -> leader at the very beginning, 7 -> Lucky number seven, 13 -> Not so unlucky)
 * 3. Generic number description (e.g. "forty-three")
 * 4. Digit announcement (e.g. "Double digit, four three, forty-three.")
 */
export function getNumberDescription(
  num: number,
  numberRange: NumberRange,
  callingStyle: CallingStyle = 'familyFriendly'
): { primary: string; secondary?: string; isTopOfHouse: boolean } {
  const isTopOfHouse = num === numberRange.end;
  const numInWords = numberToWords(num);
  const capitalizedWords = numInWords.charAt(0).toUpperCase() + numInWords.slice(1);

  if (callingStyle === 'simple') {
    return {
      primary: isTopOfHouse ? `Top of the House, ${numInWords}` : capitalizedWords,
      isTopOfHouse,
    };
  }

  // 1. Top of the House priority check
  if (isTopOfHouse) {
    const specialEntry = tambolaCalls[num];
    const topPhrase = `Top of the House, ${numInWords}`;
    // If the top number ALSO has a special phrase (e.g. 100 or 77), provide secondary in UI
    const secondary = specialEntry ? specialEntry.description : undefined;
    return {
      primary: topPhrase,
      secondary,
      isTopOfHouse: true,
    };
  }

  // 2. Explicitly configured special phrase
  const specialEntry = tambolaCalls[num];
  if (specialEntry) {
    let desc = specialEntry.description;
    if (callingStyle === 'fun' && !desc.endsWith('!')) {
      desc = `${desc}!`;
    }
    return {
      primary: desc,
      isTopOfHouse: false,
    };
  }

  // 3. Generic fallback
  return {
    primary: capitalizedWords,
    isTopOfHouse: false,
  };
}

/**
 * Builds the complete announcement object for UI and Web Speech API
 */
export function getNumberAnnouncement(
  num: number,
  numberRange: NumberRange = { start: 1, end: 90 },
  callingStyle: CallingStyle = 'familyFriendly'
): NumberAnnouncement {
  const { primary, secondary, isTopOfHouse } = getNumberDescription(num, numberRange, callingStyle);
  const digitPhrase = buildDigitAnnouncement(num);
  const spokenPhrases: string[] = [];

  if (callingStyle === 'simple') {
    if (isTopOfHouse) {
      spokenPhrases.push(primary);
    } else {
      spokenPhrases.push(numberToWords(num));
    }
    spokenPhrases.push(digitPhrase);
  } else {
    // Family Friendly or Fun
    spokenPhrases.push(primary);
    spokenPhrases.push(digitPhrase);
  }

  return {
    number: num,
    displayText: String(num),
    subDisplayText: `${primary} — ${digitPhrase}`,
    primaryDescription: primary,
    secondaryDescription: secondary,
    spokenPhrases,
  };
}
