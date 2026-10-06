import {
  GameConfig,
  GameState,
  NumberRange,
  Player,
  PlayerCard,
  PrizeCategory,
  WinnerRecord,
} from '../types/tambola';
import { generateGameCode } from '../utils/gameCodeUtils';
import { createShuffledCallingPool } from '../utils/numberRangeUtils';

export const PRIZE_LABELS: Record<PrizeCategory, string> = {
  fastFive: 'Fast Five',
  firstLine: 'First Line',
  secondLine: 'Second Line',
  thirdLine: 'Third Line',
  fullHouse: 'Full House',
  lastFive: 'Last Five',
};

/**
 * Creates a standard initial configuration with start=1 and end=90
 */
export function getDefaultGameConfig(mode: 'physical' | 'virtual' = 'physical'): GameConfig {
  return {
    mode,
    numberRange: {
      start: 1,
      end: 90,
    },
    prizes: {
      fastFive: { enabled: true, winners: 1 },
      firstLine: { enabled: true, winners: 1 },
      secondLine: { enabled: true, winners: 1 },
      thirdLine: { enabled: true, winners: 1 },
      fullHouse: { enabled: true, winners: 1 },
      lastFive: { enabled: false, winners: 0 },
    },
    lineWinnerFullHouseEligibility: true, // Line winners can continue for Full House
    voiceSettings: {
      enabled: true,
      voiceURI: '',
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      callingStyle: 'familyFriendly',
      includeNicknames: true,
    },
    soundSettings: {
      enabled: true,
      volume: 0.6,
    },
  };
}

/**
 * Initializes a new GameState with a randomly shuffled calling pool
 * separate from the visual board order.
 */
export function createNewGame(config: GameConfig): GameState {
  const pool = createShuffledCallingPool(config.numberRange.start, config.numberRange.end);
  return {
    gameId: `game-${Date.now().toString(36)}`,
    gameCode: generateGameCode(),
    config,
    status: 'ready',
    numbersPool: pool,
    calledNumbers: [],
    currentNumber: null,
    previousNumber: null,
    winners: [],
    pendingClaims: [],
    players: [],
    createdAt: Date.now(),
    hasAnnouncedRules: false,
  };
}

/**
 * Calls the next random number from the calling pool.
 * Never repeats a number.
 * Pauses after the 5th number is called ONLY if Fast Five is enabled.
 */
export function callNextNumber(state: GameState): { nextState: GameState; called: number | null } {
  if (state.numbersPool.length === 0) {
    return { nextState: state, called: null };
  }

  const [nextNumber, ...remainingPool] = state.numbersPool;
  const newCalledNumbers = [...state.calledNumbers, nextNumber];

  let newStatus = state.status;
  const isFastFiveActive = state.config.prizes.fastFive.enabled && isPrizeAvailable(state, 'fastFive');

  if (newCalledNumbers.length === 5 && isFastFiveActive) {
    newStatus = 'firstFivePaused';
  } else if (state.status === 'ready' || state.status === 'firstFivePaused') {
    newStatus = 'playing';
  }

  const nextState: GameState = {
    ...state,
    numbersPool: remainingPool,
    calledNumbers: newCalledNumbers,
    currentNumber: nextNumber,
    previousNumber: state.currentNumber,
    status: newStatus,
  };

  return { nextState, called: nextNumber };
}

/**
 * Check how many winners exist for a given category
 */
export function getWinnerCount(winners: WinnerRecord[], category: PrizeCategory): number {
  return winners.filter((w) => w.category === category).length;
}

/**
 * Checks if a specific prize category still has winning spots available
 */
export function isPrizeAvailable(state: GameState, category: PrizeCategory): boolean {
  const prizeItem = state.config.prizes[category];
  if (!prizeItem || !prizeItem.enabled || prizeItem.winners <= 0) return false;
  const currentCount = getWinnerCount(state.winners, category);
  return currentCount < prizeItem.winners;
}

/**
 * Validates whether a player is eligible to claim a prize category
 */
export function isPlayerEligibleForCategory(
  player: Player,
  category: PrizeCategory,
  config: GameConfig
): { eligible: boolean; reason?: string } {
  const prizeItem = config.prizes[category];
  if (!prizeItem || !prizeItem.enabled || prizeItem.winners <= 0) {
    return { eligible: false, reason: `${PRIZE_LABELS[category]} is not enabled for this game.` };
  }

  if (player.wonCategories.includes(category)) {
    return { eligible: false, reason: `Player has already won ${PRIZE_LABELS[category]}` };
  }

  const lineCategories: PrizeCategory[] = ['firstLine', 'secondLine', 'thirdLine'];
  const hasWonALine = player.wonCategories.some((c) => lineCategories.includes(c));

  if (lineCategories.includes(category) && hasWonALine) {
    return {
      eligible: false,
      reason: 'A player who has already won a line prize cannot claim another line.',
    };
  }

  if (category === 'fullHouse' && !config.lineWinnerFullHouseEligibility && hasWonALine) {
    return {
      eligible: false,
      reason: 'Host rules do not permit line winners to claim Full House.',
    };
  }

  return { eligible: true };
}

/**
 * Verifies if a virtual card has actually completed the given category based on called numbers
 */
export function verifyCardAchievement(
  card: PlayerCard,
  category: PrizeCategory,
  calledNumbers: number[],
  config?: GameConfig
): { completed: boolean; matchedCount: number; targetCount: number } {
  // If category is not enabled in config, do not detect victory
  if (config && config.prizes[category] && !config.prizes[category].enabled) {
    return { completed: false, matchedCount: 0, targetCount: 0 };
  }

  const calledSet = new Set(calledNumbers);

  if (category === 'fastFive') {
    const matched = card.allNumbers.filter((n) => calledSet.has(n));
    return {
      completed: matched.length >= 5,
      matchedCount: matched.length,
      targetCount: 5,
    };
  }

  if (category === 'firstLine') {
    const matched = card.row1.filter((n) => calledSet.has(n));
    return {
      completed: matched.length === 5,
      matchedCount: matched.length,
      targetCount: 5,
    };
  }

  if (category === 'secondLine') {
    const matched = card.row2.filter((n) => calledSet.has(n));
    return {
      completed: matched.length === 5,
      matchedCount: matched.length,
      targetCount: 5,
    };
  }

  if (category === 'thirdLine') {
    const matched = card.row3.filter((n) => calledSet.has(n));
    return {
      completed: matched.length === 5,
      matchedCount: matched.length,
      targetCount: 5,
    };
  }

  if (category === 'fullHouse') {
    const matched = card.allNumbers.filter((n) => calledSet.has(n));
    return {
      completed: matched.length === 15,
      matchedCount: matched.length,
      targetCount: 15,
    };
  }

  if (category === 'lastFive') {
    const recentFive = calledNumbers.slice(-5);
    const matched = card.allNumbers.filter((n) => recentFive.includes(n));
    return {
      completed: matched.length >= 5,
      matchedCount: matched.length,
      targetCount: 5,
    };
  }

  return { completed: false, matchedCount: 0, targetCount: 0 };
}

/**
 * Checks if all configured prizes have been won
 */
export function areAllConfiguredPrizesWon(state: GameState): boolean {
  const prizes = state.config.prizes;
  for (const [cat, item] of Object.entries(prizes) as [PrizeCategory, { enabled: boolean; winners: number }][]) {
    if (item.enabled && item.winners > 0) {
      const current = getWinnerCount(state.winners, cat);
      if (current < item.winners) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Records an approved winner claim
 */
export function recordWinner(
  state: GameState,
  playerName: string,
  category: PrizeCategory,
  playerId?: string,
  ticketNumber?: number
): GameState {
  const newWinner: WinnerRecord = {
    id: `win-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    category,
    categoryName: PRIZE_LABELS[category],
    playerName,
    playerId,
    ticketNumber,
    numberWhenWon: state.currentNumber || 0,
    callCountWhenWon: state.calledNumbers.length,
    timestamp: Date.now(),
  };

  const updatedWinners = [...state.winners, newWinner];

  let updatedPlayers = state.players;
  if (playerId) {
    updatedPlayers = state.players.map((p) => {
      if (p.id === playerId) {
        const wonCats = [...p.wonCategories, category];
        const isLineWinner = ['firstLine', 'secondLine', 'thirdLine'].includes(category);
        const fullHouseEligible =
          p.fullHouseEligible &&
          (!isLineWinner || state.config.lineWinnerFullHouseEligibility);
        return {
          ...p,
          wonCategories: wonCats,
          fullHouseEligible,
        };
      }
      return p;
    });
  }

  const updatedPending = state.pendingClaims.filter(
    (c) => !(c.playerId === playerId && c.category === category)
  );

  let newStatus = state.status;
  const tempState: GameState = {
    ...state,
    winners: updatedWinners,
    players: updatedPlayers,
    pendingClaims: updatedPending,
  };

  if (areAllConfiguredPrizesWon(tempState) && state.status !== 'finished') {
    newStatus = 'allPrizesClaimed';
  }

  return {
    ...tempState,
    status: newStatus,
  };
}
