/**
 * Comprehensive Family-Friendly Tambola Call Dictionary
 * Contains clean, inclusive, wholesome cultural & milestone phrases.
 * Excludes discriminatory, body-shaming, or negative superstitious remarks.
 * NOTE: "Top of the House" is intentionally NOT statically bound to 90 because
 * it is dynamically computed based on the game's configured maximum range number (numberRange.end).
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
    description: 'High five, Punjab Mail',
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
    additionalPhrase: 'Colours of the rainbow',
    familyFriendly: true,
  },
  8: {
    number: 8,
    description: 'Garden gate, number eight',
    familyFriendly: true,
  },
  9: {
    number: 9,
    description: 'Doctor’s time, shining bright',
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
    description: 'One dozen, number twelve',
    familyFriendly: true,
  },
  13: {
    number: 13,
    description: 'Thirteen, not so unlucky today!',
    familyFriendly: true,
  },
  14: {
    number: 14,
    description: 'Valentine’s Day of kindness',
    familyFriendly: true,
  },
  15: {
    number: 15,
    description: 'Young and keen, number fifteen',
    familyFriendly: true,
  },
  16: {
    number: 16,
    description: 'Sweet sixteen, never been seen',
    familyFriendly: true,
  },
  17: {
    number: 17,
    description: 'Dancing queen, seventeen',
    familyFriendly: true,
  },
  18: {
    number: 18,
    description: 'Milestone eighteen, voting age',
    familyFriendly: true,
  },
  19: {
    number: 19,
    description: 'Goodbye teens, number nineteen',
    familyFriendly: true,
  },
  20: {
    number: 20,
    description: 'A round score of twenty',
    familyFriendly: true,
  },
  21: {
    number: 21,
    description: 'Royal salute, key of the door',
    familyFriendly: true,
  },
  22: {
    number: 22,
    description: 'Two little ducks swimming, twenty-two',
    familyFriendly: true,
  },
  23: {
    number: 23,
    description: 'You and me, twenty-three',
    familyFriendly: true,
  },
  24: {
    number: 24,
    description: 'Two dozen, twenty-four hours in a day',
    familyFriendly: true,
  },
  25: {
    number: 25,
    description: 'Silver Jubilee, quarter of a century',
    familyFriendly: true,
  },
  26: {
    number: 26,
    description: 'Republic Day celebration',
    familyFriendly: true,
  },
  27: {
    number: 27,
    description: 'Gateway to fun, twenty-seven',
    familyFriendly: true,
  },
  28: {
    number: 28,
    description: 'Over the gate, twenty-eight',
    familyFriendly: true,
  },
  29: {
    number: 29,
    description: 'Rise and shine, twenty-nine',
    familyFriendly: true,
  },
  30: {
    number: 30,
    description: 'Wonderful thirty, speed limit',
    familyFriendly: true,
  },
  31: {
    number: 31,
    description: 'Time for fun, thirty-one',
    familyFriendly: true,
  },
  32: {
    number: 32,
    description: 'Buckle my shoe, full set of teeth',
    familyFriendly: true,
  },
  33: {
    number: 33,
    description: 'All the threes, thirty-three',
    familyFriendly: true,
  },
  34: {
    number: 34,
    description: 'Lion’s roar, thirty-four',
    familyFriendly: true,
  },
  35: {
    number: 35,
    description: 'Jump and jive, thirty-five',
    familyFriendly: true,
  },
  36: {
    number: 36,
    description: 'Three dozen, thirty-six',
    familyFriendly: true,
  },
  37: {
    number: 37,
    description: 'Lucky heaven, thirty-seven',
    familyFriendly: true,
  },
  38: {
    number: 38,
    description: 'Golden gate, thirty-eight',
    familyFriendly: true,
  },
  39: {
    number: 39,
    description: 'Watch the line, thirty-nine',
    familyFriendly: true,
  },
  40: {
    number: 40,
    description: 'Life begins at forty',
    familyFriendly: true,
  },
  41: {
    number: 41,
    description: 'Life’s begun, forty-one',
    familyFriendly: true,
  },
  42: {
    number: 42,
    description: 'Answer to the universe, forty-two',
    familyFriendly: true,
  },
  43: {
    number: 43,
    description: 'Down on your knee, forty-three',
    familyFriendly: true,
  },
  44: {
    number: 44,
    description: 'All the fours, forty-four',
    familyFriendly: true,
  },
  45: {
    number: 45,
    description: 'Halfway to ninety, forty-five',
    familyFriendly: true,
  },
  46: {
    number: 46,
    description: 'Up to tricks, forty-six',
    familyFriendly: true,
  },
  47: {
    number: 47,
    description: 'Year of Independence celebration, forty-seven',
    familyFriendly: true,
  },
  48: {
    number: 48,
    description: 'Four dozen, forty-eight',
    familyFriendly: true,
  },
  49: {
    number: 49,
    description: 'Nick of time, forty-nine',
    familyFriendly: true,
  },
  50: {
    number: 50,
    description: 'Half a century, Golden milestone, fifty',
    familyFriendly: true,
  },
  51: {
    number: 51,
    description: 'Shagun ka rupiya, auspicious fifty-one',
    familyFriendly: true,
  },
  52: {
    number: 52,
    description: 'Weeks in a wonderful year, fifty-two',
    familyFriendly: true,
  },
  53: {
    number: 53,
    description: 'Pack of cards with a joker, fifty-three',
    familyFriendly: true,
  },
  54: {
    number: 54,
    description: 'Clean the floor, fifty-four',
    familyFriendly: true,
  },
  55: {
    number: 55,
    description: 'All the fives, double nickels, fifty-five',
    familyFriendly: true,
  },
  56: {
    number: 56,
    description: 'Was it worth it?, fifty-six',
    familyFriendly: true,
  },
  57: {
    number: 57,
    description: 'All the varieties, fifty-seven',
    familyFriendly: true,
  },
  58: {
    number: 58,
    description: 'Make them wait, fifty-eight',
    familyFriendly: true,
  },
  59: {
    number: 59,
    description: 'Just in time, fifty-nine',
    familyFriendly: true,
  },
  60: {
    number: 60,
    description: 'Diamond milestone, sixty',
    familyFriendly: true,
  },
  61: {
    number: 61,
    description: 'Baker’s bun, sixty-one',
    familyFriendly: true,
  },
  62: {
    number: 62,
    description: 'Turn the screw, sixty-two',
    familyFriendly: true,
  },
  63: {
    number: 63,
    description: 'Tickle me, sixty-three',
    familyFriendly: true,
  },
  64: {
    number: 64,
    description: 'Red and warm, sixty-four',
    familyFriendly: true,
  },
  65: {
    number: 65,
    description: 'Retirement age, sixty-five',
    familyFriendly: true,
  },
  66: {
    number: 66,
    description: 'Clickety click, sixty-six',
    familyFriendly: true,
  },
  67: {
    number: 67,
    description: 'Made in heaven, sixty-seven',
    familyFriendly: true,
  },
  68: {
    number: 68,
    description: 'Pick up your skate, sixty-eight',
    familyFriendly: true,
  },
  69: {
    number: 69,
    description: 'Ulta pulta, sixty-nine',
    familyFriendly: true,
  },
  70: {
    number: 70,
    description: 'Three score and ten, seventy',
    familyFriendly: true,
  },
  71: {
    number: 71,
    description: 'Bang on the drum, seventy-one',
    familyFriendly: true,
  },
  72: {
    number: 72,
    description: 'Six dozen, a lucky pair, seventy-two',
    familyFriendly: true,
  },
  73: {
    number: 73,
    description: 'Under the tree, seventy-three',
    familyFriendly: true,
  },
  74: {
    number: 74,
    description: 'Candy store, seventy-four',
    familyFriendly: true,
  },
  75: {
    number: 75,
    description: 'Platinum milestone, seventy-five',
    familyFriendly: true,
  },
  76: {
    number: 76,
    description: 'Trombones in the parade, seventy-six',
    familyFriendly: true,
  },
  77: {
    number: 77,
    description: 'Hum Saath Saath Hai, seventy-seven',
    familyFriendly: true,
  },
  78: {
    number: 78,
    description: 'Heaven’s gate, seventy-eight',
    familyFriendly: true,
  },
  79: {
    number: 79,
    description: 'Almost eighty, one more step, seventy-nine',
    familyFriendly: true,
  },
  80: {
    number: 80,
    description: 'Gandhi’s charkha, four score, eighty',
    familyFriendly: true,
  },
  81: {
    number: 81,
    description: 'Corner shot, eighty-one',
    familyFriendly: true,
  },
  82: {
    number: 82,
    description: 'Straight on through, eighty-two',
    familyFriendly: true,
  },
  83: {
    number: 83,
    description: 'Time for tea, eighty-three',
    familyFriendly: true,
  },
  84: {
    number: 84,
    description: 'Seven dozen, eighty-four',
    familyFriendly: true,
  },
  85: {
    number: 85,
    description: 'Staying alive, eighty-five',
    familyFriendly: true,
  },
  86: {
    number: 86,
    description: 'Between the sticks, eighty-six',
    familyFriendly: true,
  },
  87: {
    number: 87,
    description: 'Cricket score, eighty-seven',
    familyFriendly: true,
  },
  88: {
    number: 88,
    description: 'Two snowmen together, eighty-eight',
    familyFriendly: true,
  },
  89: {
    number: 89,
    description: 'On the doorstep of ninety, nearly there',
    familyFriendly: true,
  },
  90: {
    number: 90,
    description: 'Top of the classic house, ninety',
    familyFriendly: true,
  },
  91: {
    number: 91,
    description: 'On the nineties run, ninety-one',
    familyFriendly: true,
  },
  92: {
    number: 92,
    description: 'Nearly there, ninety-two',
    familyFriendly: true,
  },
  93: {
    number: 93,
    description: 'Deep in the house, ninety-three',
    familyFriendly: true,
  },
  94: {
    number: 94,
    description: 'Golden score, ninety-four',
    familyFriendly: true,
  },
  95: {
    number: 95,
    description: 'Almost century, ninety-five',
    familyFriendly: true,
  },
  96: {
    number: 96,
    description: 'Reverse and turn, ninety-six',
    familyFriendly: true,
  },
  97: {
    number: 97,
    description: 'Century door, ninety-seven',
    familyFriendly: true,
  },
  98: {
    number: 98,
    description: 'Two to go, ninety-eight',
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
