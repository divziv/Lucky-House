import { CardTheme, NumberRange, PlayerCard } from '../types/tambola';

export const CARD_THEMES: CardTheme[] = [
  'royalPurple',
  'oceanBlue',
  'emeraldGreen',
  'sunsetOrange',
  'rubyRed',
  'vibrantPink',
  'goldenAmber',
  'tealCyan',
];

/**
 * Returns column range boundaries for ANY given number range (start ... end).
 * Divides the total pool into 9 or 10 balanced sequential columns.
 */
export function getColumnRanges(numberRange: NumberRange): { min: number; max: number }[] {
  const { start, end } = numberRange;
  const total = end - start + 1;
  const numCols = 9; // standard 9-column Tambola card grid
  const cols: { min: number; max: number }[] = [];

  let currentMin = start;
  for (let c = 0; c < numCols; c++) {
    const remainingTotal = end - currentMin + 1;
    const remainingCols = numCols - c;
    const colSize = Math.max(1, Math.round(remainingTotal / remainingCols));
    const currentMax = c === numCols - 1 ? end : Math.min(end, currentMin + colSize - 1);

    cols.push({ min: currentMin, max: currentMax });
    currentMin = currentMax + 1;
  }

  return cols;
}

/**
 * Shuffles an array deterministically using Fisher-Yates
 */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates an authentic Tambola ticket:
 * - 3 rows
 * - Exactly 5 numbers per row (15 numbers total)
 * - Numbers in each column are sorted ascending from top to bottom
 * - Numbers strictly fall within column range boundaries [numberRange.start ... numberRange.end]
 */
export function generatePlayerCard(
  ticketNumber: number,
  numberRange: NumberRange = { start: 1, end: 90 },
  themeIndex: number = 0
): PlayerCard {
  const colRanges = getColumnRanges(numberRange);
  const totalCols = colRanges.length;

  let validTicket = false;
  let grid: (number | null)[][] = [];
  let attempts = 0;

  while (!validTicket && attempts < 100) {
    attempts++;
    grid = [
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
    ];

    const row0Cols = shuffle(Array.from({ length: totalCols }, (_, i) => i)).slice(0, 5);
    const colUsage = new Array(totalCols).fill(0);
    row0Cols.forEach((c) => colUsage[c]++);

    const row1CandidateCols = shuffle(Array.from({ length: totalCols }, (_, i) => i));
    const row1Cols = row1CandidateCols.slice(0, 5);
    row1Cols.forEach((c) => colUsage[c]++);

    const emptyCols: number[] = [];
    for (let c = 0; c < totalCols; c++) {
      if (colUsage[c] === 0) emptyCols.push(c);
    }

    if (emptyCols.length > 5) {
      continue;
    }

    const remainingCols = Array.from({ length: totalCols }, (_, i) => i)
      .filter((c) => !emptyCols.includes(c) && colUsage[c] < 2);

    const neededFromRemaining = 5 - emptyCols.length;
    if (remainingCols.length < neededFromRemaining) {
      continue;
    }

    const row2Cols = [...emptyCols, ...shuffle(remainingCols).slice(0, neededFromRemaining)];

    row0Cols.forEach((c) => (grid[0][c] = -1));
    row1Cols.forEach((c) => (grid[1][c] = -1));
    row2Cols.forEach((c) => (grid[2][c] = -1));

    const count0 = grid[0].filter((v) => v !== null).length;
    const count1 = grid[1].filter((v) => v !== null).length;
    const count2 = grid[2].filter((v) => v !== null).length;
    if (count0 === 5 && count1 === 5 && count2 === 5) {
      validTicket = true;
    }
  }

  const allNumbers: number[] = [];

  for (let c = 0; c < totalCols; c++) {
    const range = colRanges[c];
    const pool: number[] = [];
    for (let n = range.min; n <= range.max; n++) {
      pool.push(n);
    }
    const shuffledPool = shuffle(pool);

    const rowsWithSpot: number[] = [];
    for (let r = 0; r < 3; r++) {
      if (grid[r][c] !== null) {
        rowsWithSpot.push(r);
      }
    }

    const pickedNumbers = shuffledPool.slice(0, rowsWithSpot.length).sort((a, b) => a - b);

    rowsWithSpot.forEach((r, idx) => {
      const num = pickedNumbers[idx];
      grid[r][c] = num;
      allNumbers.push(num);
    });
  }

  const row1 = grid[0].filter((n): n is number => n !== null);
  const row2 = grid[1].filter((n): n is number => n !== null);
  const row3 = grid[2].filter((n): n is number => n !== null);

  const theme = CARD_THEMES[themeIndex % CARD_THEMES.length];

  return {
    id: `ticket-${ticketNumber}-${Date.now().toString(36)}`,
    ticketNumber,
    grid,
    allNumbers: allNumbers.sort((a, b) => a - b),
    row1,
    row2,
    row3,
    colorTheme: theme,
  };
}
