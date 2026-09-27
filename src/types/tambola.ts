export type GameMode = 'physical' | 'virtual';

export interface NumberRange {
  start: number;
  end: number;
}

export type CallingStyle = 'simple' | 'classic' | 'familyFriendly' | 'fun';

export type PrizeCategory = 
  | 'fastFive'
  | 'firstLine'
  | 'secondLine'
  | 'thirdLine'
  | 'fullHouse'
  | 'lastFive';

export interface PrizeConfig {
  fastFive: number; // always max 1
  firstLine: number;
  secondLine: number;
  thirdLine: number;
  fullHouse: number;
  lastFive: number; // optional, 0 = disabled
}

export interface VoiceSettings {
  enabled: boolean;
  voiceURI: string;
  rate: number; // 0.5 to 2
  pitch: number; // 0.5 to 1.5
  volume: number; // 0 to 1
  callingStyle: CallingStyle;
  includeNicknames: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
}

export interface GameConfig {
  mode: GameMode;
  numberRange: NumberRange;
  prizes: PrizeConfig;
  lineWinnerFullHouseEligibility: boolean; // Can a player who won a line win Full House?
  voiceSettings: VoiceSettings;
  soundSettings: SoundSettings;
}

export interface TicketCell {
  value: number | null; // null for blank space
  called: boolean;
  marked: boolean; // marked by player
}

// 3 rows x 9 columns standard ticket format (5 numbers per row = 15 numbers total)
export type TicketGrid = (number | null)[][];

export interface PlayerCard {
  id: string;
  ticketNumber: number;
  grid: (number | null)[][];
  allNumbers: number[];
  row1: number[];
  row2: number[];
  row3: number[];
  colorTheme: CardTheme;
}

export type CardTheme = 
  | 'royalPurple' 
  | 'oceanBlue' 
  | 'emeraldGreen' 
  | 'sunsetOrange' 
  | 'rubyRed' 
  | 'vibrantPink' 
  | 'goldenAmber' 
  | 'tealCyan';

export interface Player {
  id: string;
  name: string;
  card: PlayerCard;
  wonCategories: PrizeCategory[];
  fullHouseEligible: boolean;
  connected: boolean;
  joinedAt: number;
}

export interface WinnerRecord {
  id: string;
  category: PrizeCategory;
  categoryName: string;
  playerName: string;
  playerId?: string;
  ticketNumber?: number;
  numberWhenWon: number;
  callCountWhenWon: number;
  timestamp: number;
}

export interface ClaimRequest {
  id: string;
  playerId: string;
  playerName: string;
  ticketNumber?: number;
  category: PrizeCategory;
  timestamp: number;
  status: 'pending' | 'verified' | 'rejected';
}

export type GameStatus = 
  | 'configuring' 
  | 'ready' 
  | 'playing' 
  | 'firstFivePaused' 
  | 'allPrizesClaimed' 
  | 'finished';

export interface GameState {
  gameId: string;
  gameCode: string;
  config: GameConfig;
  status: GameStatus;
  numbersPool: number[];
  calledNumbers: number[];
  currentNumber: number | null;
  previousNumber: number | null;
  winners: WinnerRecord[];
  pendingClaims: ClaimRequest[];
  players: Player[];
  createdAt: number;
  hasAnnouncedRules: boolean;
}
