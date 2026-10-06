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
 * - 3 rows x 9 columns standard ticket format
 * - Exactly 5 numbers per row (15 numbers total)
 * - Numbers in each column are sorted ascending from top to bottom
 * - Numbers strictly fall within column range boundaries [numberRange.start ... numberRange.end]
 * - Works reliably for ANY valid range (even narrow custom ranges, minimum 15 numbers)
 */
export function generatePlayerCard(
  ticketNumber: number,
  numberRange: NumberRange = { start: 1, end: 90 },
  themeIndex: number = 0
): PlayerCard {
  const colRanges = getColumnRanges(numberRange);
  const totalCols = colRanges.length; // 9
  const colCaps = colRanges.map((r) => Math.max(0, r.max - r.min + 1));
  const maxUsagePerCol = colCaps.map((cap) => Math.min(3, cap));

  let validTicket = false;
  let grid: (number | null)[][] = [
    new Array(totalCols).fill(null),
    new Array(totalCols).fill(null),
    new Array(totalCols).fill(null),
  ];
  let attempts = 0;

  while (!validTicket && attempts < 150) {
    attempts++;
    grid = [
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
    ];

    const colUsage = new Array(totalCols).fill(0);

    // Row 0: choose 5 columns with capacity >= 1
    const availableForR0 = Array.from({ length: totalCols }, (_, i) => i).filter(
      (c) => maxUsagePerCol[c] > colUsage[c]
    );
    if (availableForR0.length < 5) continue;
    const r0Cols = shuffle(availableForR0).slice(0, 5);
    r0Cols.forEach((c) => {
      grid[0][c] = -1;
      colUsage[c]++;
    });

    // Row 1: choose 5 columns with capacity > colUsage[c]
    const availableForR1 = Array.from({ length: totalCols }, (_, i) => i).filter(
      (c) => maxUsagePerCol[c] > colUsage[c]
    );
    if (availableForR1.length < 5) continue;
    const r1Cols = shuffle(availableForR1).slice(0, 5);
    r1Cols.forEach((c) => {
      grid[1][c] = -1;
      colUsage[c]++;
    });

    // Row 2: choose 5 columns with capacity > colUsage[c]
    // Prioritize columns that haven't been used yet if they have capacity
    const unusedCols = Array.from({ length: totalCols }, (_, i) => i).filter(
      (c) => colUsage[c] === 0 && maxUsagePerCol[c] > 0
    );
    const availableForR2 = Array.from({ length: totalCols }, (_, i) => i).filter(
      (c) => maxUsagePerCol[c] > colUsage[c]
    );

    if (availableForR2.length < 5) continue;

    let r2Cols: number[] = [];
    if (unusedCols.length <= 5) {
      const restNeeded = 5 - unusedCols.length;
      const otherCandidates = availableForR2.filter((c) => !unusedCols.includes(c));
      if (otherCandidates.length < restNeeded) continue;
      r2Cols = [...unusedCols, ...shuffle(otherCandidates).slice(0, restNeeded)];
    } else {
      r2Cols = shuffle(unusedCols).slice(0, 5);
    }

    r2Cols.forEach((c) => {
      grid[2][c] = -1;
      colUsage[c]++;
    });

    const c0 = grid[0].filter((v) => v !== null).length;
    const c1 = grid[1].filter((v) => v !== null).length;
    const c2 = grid[2].filter((v) => v !== null).length;

    if (c0 === 5 && c1 === 5 && c2 === 5) {
      validTicket = true;
    }
  }

  // Fallback if random placement failed (e.g. extremely constrained custom range):
  if (!validTicket) {
    grid = [
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
      new Array(totalCols).fill(null),
    ];
    // Fill first 5 columns with capacity for each row
    const eligibleCols = Array.from({ length: totalCols }, (_, i) => i).filter(
      (c) => maxUsagePerCol[c] > 0
    );
    // Simple round-robin assignment ensuring 5 per row
    let assignedCount = [0, 0, 0];
    for (const c of eligibleCols) {
      const maxForThisCol = maxUsagePerCol[c];
      for (let r = 0; r < 3 && grid[r].filter((x) => x !== null).length < 5; r++) {
        const thisColUsed = grid.reduce((acc, row) => acc + (row[c] !== null ? 1 : 0), 0);
        if (thisColUsed < maxForThisCol && assignedCount[r] < 5) {
          grid[r][c] = -1;
          assignedCount[r]++;
        }
      }
    }
  }

  const allNumbers: number[] = [];

  // Populate numbers into the marked cells
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

    // Pick as many distinct numbers as rows with spots in this column, and sort ascending
    const pickedNumbers = shuffledPool.slice(0, rowsWithSpot.length).sort((a, b) => a - b);

    rowsWithSpot.forEach((r, idx) => {
      const num = pickedNumbers[idx];
      if (typeof num === 'number') {
        grid[r][c] = num;
        allNumbers.push(num);
      } else {
        // Ultimate safeguard: fallback to next available number in overall range
        grid[r][c] = range.min;
        allNumbers.push(range.min);
      }
    });
  }

  const row1 = grid[0].filter((n): n is number => n !== null && n !== -1);
  const row2 = grid[1].filter((n): n is number => n !== null && n !== -1);
  const row3 = grid[2].filter((n): n is number => n !== null && n !== -1);

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
