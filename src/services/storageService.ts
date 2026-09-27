import { GameState } from '../types/tambola';

const STORAGE_KEY = 'tambola_royal_active_game';
const PREFS_KEY = 'tambola_royal_preferences';

export interface UserPreferences {
  voiceEnabled: boolean;
  soundEnabled: boolean;
  voiceURI: string;
  speechRate: number;
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
    return JSON.parse(raw) as GameState;
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
