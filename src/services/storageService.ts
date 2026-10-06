import { GameState, PrizeConfig } from '../types/tambola';

const STORAGE_KEY = 'tambola_royal_active_game';
const PREFS_KEY = 'tambola_royal_preferences';

export interface UserPreferences {
  voiceEnabled: boolean;
  soundEnabled: boolean;
  voiceURI: string;
  speechRate: number;
}

function normalizePrizes(rawPrizes: any): PrizeConfig {
  const norm = (val: any, defaultEnabled = true, defaultWinners = 1) => {
    if (typeof val === 'number') {
      return { enabled: val > 0, winners: Math.max(val, 0) };
    }
    if (val && typeof val === 'object') {
      return {
        enabled: Boolean(val.enabled),
        winners: typeof val.winners === 'number' ? val.winners : (val.enabled ? defaultWinners : 0),
      };
    }
    return { enabled: defaultEnabled, winners: defaultWinners };
  };

  return {
    fastFive: norm(rawPrizes?.fastFive, true, 1),
    firstLine: norm(rawPrizes?.firstLine, true, 1),
    secondLine: norm(rawPrizes?.secondLine, true, 1),
    thirdLine: norm(rawPrizes?.thirdLine, true, 1),
    fullHouse: norm(rawPrizes?.fullHouse, true, 1),
    lastFive: norm(rawPrizes?.lastFive, false, 0),
  };
}

export function saveActiveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadActiveGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed && parsed.config) {
      parsed.config.prizes = normalizePrizes(parsed.config.prizes);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

export function loadUserPreferences(): UserPreferences | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserPreferences;
  } catch {
    return null;
  }
}
