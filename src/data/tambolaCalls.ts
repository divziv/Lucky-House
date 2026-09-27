/**
 * Family-Friendly Tambola Call Dictionary
 * Contains clean, inclusive, wholesome cultural & milestone phrases.
 * Excludes discriminatory, body-shaming, or negative superstitious remarks.
 * NOTE: "Top of the House" is intentionally NOT here because it is dynamically
 * computed based on the game's configured maximum range number (numberRange.end).
 */

export interface TambolaCallEntry {
  number: number;
  description: string;
  additionalPhrase?: string;
  familyFriendly: boolean;
}

export const tambolaCalls: Record<number, TambolaCallEntry> = {
  1: {
    number: 1,
    description: 'The leader at the very beginning',
    familyFriendly: true,
  },
  2: {
    number: 2,
    description: 'Two little ducks in a row',
    familyFriendly: true,
  },
  3: {
    number: 3,
    description: 'A cozy cup of tea',
    familyFriendly: true,
  },
  4: {
    number: 4,
    description: 'A friendly knock at the door',
    familyFriendly: true,
  },
  5: {
    number: 5,
    description: 'Five fingers high five',
    familyFriendly: true,
  },
  6: {
    number: 6,
    description: 'Half a dozen',
    familyFriendly: true,
  },
  7: {
    number: 7,
    description: 'Lucky number seven',
    familyFriendly: true,
  },
  8: {
    number: 8,
    description: 'Garden gate, number eight',
    familyFriendly: true,
  },
  9: {
    number: 9,
    description: 'Shining bright, number nine',
    familyFriendly: true,
  },
  10: {
    number: 10,
    description: 'A great big ten',
    familyFriendly: true,
  },
  11: {
    number: 11,
    description: 'Two number ones standing proud',
    familyFriendly: true,
  },
  12: {
    number: 12,
    description: 'One dozen',
    familyFriendly: true,
  },
  13: {
    number: 13,
    description: 'Thirteen, not so unlucky today!',
    familyFriendly: true,
  },
  14: {
    number: 14,
    description: 'Valentine day of kindness',
    familyFriendly: true,
  },
  15: {
    number: 15,
    description: 'Young and keen',
    familyFriendly: true,
  },
  16: {
    number: 16,
    description: 'Sweet sixteen',
    familyFriendly: true,
  },
  17: {
    number: 17,
    description: 'Dancing queen, seventeen',
    familyFriendly: true,
  },
  18: {
    number: 18,
    description: 'Milestone eighteen',
    familyFriendly: true,
  },
  19: {
    number: 19,
    description: 'Goodbye teens',
    familyFriendly: true,
  },
  20: {
    number: 20,
    description: 'A round score of twenty',
    familyFriendly: true,
  },
  21: {
    number: 21,
    description: 'Royal salute, twenty-one',
    familyFriendly: true,
  },
  22: {
    number: 22,
    description: 'Two little ducks swimming, twenty-two',
    familyFriendly: true,
  },
  24: {
    number: 24,
    description: 'Two dozen, twenty-four hours in a day',
    familyFriendly: true,
  },
  25: {
    number: 25,
    description: 'Silver Jubilee, twenty-five',
    familyFriendly: true,
  },
  26: {
    number: 26,
    description: 'Republic Day celebration',
    familyFriendly: true,
  },
  30: {
    number: 30,
    description: 'Wonderful thirty',
    familyFriendly: true,
  },
  33: {
    number: 33,
    description: 'All the threes, thirty-three',
    familyFriendly: true,
  },
  36: {
    number: 36,
    description: 'Three dozen',
    familyFriendly: true,
  },
  40: {
    number: 40,
    description: 'Life begins at forty',
    familyFriendly: true,
  },
  44: {
    number: 44,
    description: 'All the fours, forty-four',
    familyFriendly: true,
  },
  45: {
    number: 45,
    description: 'Halfway to ninety',
    familyFriendly: true,
  },
  47: {
    number: 47,
    description: 'Year of Independence celebration',
    familyFriendly: true,
  },
  48: {
    number: 48,
    description: 'Four dozen',
    familyFriendly: true,
  },
  50: {
    number: 50,
    description: 'Half a century, Silver Jubilee, fifty',
    familyFriendly: true,
  },
  52: {
    number: 52,
    description: 'Weeks in a wonderful year',
    familyFriendly: true,
  },
  55: {
    number: 55,
    description: 'All the fives, fifty-five',
    familyFriendly: true,
  },
  60: {
    number: 60,
    description: 'Diamond milestone, sixty',
    familyFriendly: true,
  },
  66: {
    number: 66,
    description: 'Clickety click, sixty-six',
    familyFriendly: true,
  },
  69: {
    number: 69,
    description: 'Ulta pulta, sixty-nine',
    familyFriendly: true,
  },
  75: {
    number: 75,
    description: 'Platinum milestone, seventy-five',
    familyFriendly: true,
  },
  77: {
    number: 77,
    description: 'Hum Saath Saath Hai, seventy-seven',
    familyFriendly: true,
  },
  88: {
    number: 88,
    description: 'Two snowmen together, eighty-eight',
    familyFriendly: true,
  },
  99: {
    number: 99,
    description: 'Century on the doorstep, ninety-nine',
    familyFriendly: true,
  },
  100: {
    number: 100,
    description: 'Century, one hundred',
    familyFriendly: true,
  },
};
