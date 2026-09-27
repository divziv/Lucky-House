import { ClaimRequest, GameState, Player } from '../types/tambola';

export interface IGameSessionService {
  mode: 'local-broadcast' | 'remote-cloud';
  initHost(gameCode: string, initialState: GameState): void;
  broadcastState(state: GameState): void;
  submitClaim(claim: ClaimRequest): void;
  joinPlayer(gameCode: string, player: Player): Promise<{ success: boolean; state?: GameState; message?: string }>;
  onStateChange(callback: (state: GameState) => void): () => void;
  onClaimSubmitted(callback: (claim: ClaimRequest) => void): () => void;
  onPlayerJoined(callback: (player: Player) => void): () => void;
  disconnect(): void;
}

type SessionMessage = 
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'CLAIM_SUBMITTED'; claim: ClaimRequest }
  | { type: 'PLAYER_JOINED'; player: Player; gameCode: string }
  | { type: 'REQUEST_CURRENT_STATE'; gameCode: string };

/**
 * Local implementation using BroadcastChannel API + LocalStorage fallback.
 * Allows multiple browser tabs/windows on the same machine to play in real-time,
 * fulfilling local multi-player testing and game display without any external server!
 */
export class LocalGameSessionService implements IGameSessionService {
  public mode: 'local-broadcast' = 'local-broadcast';
  private channel: BroadcastChannel | null = null;
  private gameCode: string = '';
  private stateSubscribers: Set<(state: GameState) => void> = new Set();
  private claimSubscribers: Set<(claim: ClaimRequest) => void> = new Set();
  private playerSubscribers: Set<(player: Player) => void> = new Set();
  private currentState: GameState | null = null;

  constructor() {
    this.setupStorageFallback();
  }

  private getChannelName(code: string): string {
    return `tambola_session_${code.toUpperCase().trim()}`;
  }

  public initHost(gameCode: string, initialState: GameState) {
    this.gameCode = gameCode;
    this.currentState = initialState;
    this.connectChannel(gameCode);
    this.saveToStorage(initialState);
  }

  private connectChannel(gameCode: string) {
    if (this.channel) {
      this.channel.close();
    }
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.getChannelName(gameCode));
        this.channel.onmessage = (event: MessageEvent<SessionMessage>) => {
          this.handleIncomingMessage(event.data);
        };
      } catch {
        this.channel = null;
      }
    }
  }

  private handleIncomingMessage(msg: SessionMessage) {
    if (!msg || !msg.type) return;

    if (msg.type === 'STATE_UPDATE') {
      this.currentState = msg.state;
      this.stateSubscribers.forEach((cb) => cb(msg.state));
    } else if (msg.type === 'CLAIM_SUBMITTED') {
      this.claimSubscribers.forEach((cb) => cb(msg.claim));
    } else if (msg.type === 'PLAYER_JOINED') {
      if (this.gameCode === msg.gameCode) {
        this.playerSubscribers.forEach((cb) => cb(msg.player));
        // Host responds by broadcasting current state
        if (this.currentState) {
          this.broadcastState(this.currentState);
        }
      }
    } else if (msg.type === 'REQUEST_CURRENT_STATE') {
      if (this.gameCode === msg.gameCode && this.currentState) {
        this.broadcastState(this.currentState);
      }
    }
  }

  private setupStorageFallback() {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('tambola_sync_') && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as SessionMessage;
          this.handleIncomingMessage(parsed);
        } catch {}
      }
    });
  }

  private saveToStorage(state: GameState) {
    try {
      localStorage.setItem(`tambola_game_${state.gameCode}`, JSON.stringify(state));
    } catch {}
  }

  public broadcastState(state: GameState) {
    this.currentState = state;
    this.saveToStorage(state);
    const msg: SessionMessage = { type: 'STATE_UPDATE', state };

    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {}
    }

    try {
      localStorage.setItem(`tambola_sync_${state.gameCode}`, JSON.stringify({ ...msg, _t: Date.now() }));
    } catch {}

    this.stateSubscribers.forEach((cb) => cb(state));
  }

  public submitClaim(claim: ClaimRequest) {
    const msg: SessionMessage = { type: 'CLAIM_SUBMITTED', claim };
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {}
    }
    try {
      localStorage.setItem(`tambola_sync_${this.gameCode}`, JSON.stringify({ ...msg, _t: Date.now() }));
    } catch {}
    this.claimSubscribers.forEach((cb) => cb(claim));
  }

  public async joinPlayer(gameCode: string, player: Player): Promise<{ success: boolean; state?: GameState; message?: string }> {
    this.gameCode = gameCode;
    this.connectChannel(gameCode);

    // Check stored state first
    let loadedState: GameState | null = null;
    try {
      const stored = localStorage.getItem(`tambola_game_${gameCode.toUpperCase().trim()}`);
      if (stored) {
        loadedState = JSON.parse(stored) as GameState;
      }
    } catch {}

    const msg: SessionMessage = { type: 'PLAYER_JOINED', player, gameCode };
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {}
    }
    try {
      localStorage.setItem(`tambola_sync_${gameCode}`, JSON.stringify({ ...msg, _t: Date.now() }));
    } catch {}

    if (loadedState) {
      this.currentState = loadedState;
      return { success: true, state: loadedState };
    }

    return {
      success: true,
      message: 'Joined session. Waiting for host game synchronization.',
    };
  }

  public onStateChange(callback: (state: GameState) => void): () => void {
    this.stateSubscribers.add(callback);
    if (this.currentState) {
      callback(this.currentState);
    }
    return () => {
      this.stateSubscribers.delete(callback);
    };
  }

  public onClaimSubmitted(callback: (claim: ClaimRequest) => void): () => void {
    this.claimSubscribers.add(callback);
    return () => {
      this.claimSubscribers.delete(callback);
    };
  }

  public onPlayerJoined(callback: (player: Player) => void): () => void {
    this.playerSubscribers.add(callback);
    return () => {
      this.playerSubscribers.delete(callback);
    };
  }

  public disconnect() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.stateSubscribers.clear();
    this.claimSubscribers.clear();
    this.playerSubscribers.clear();
  }
}

/**
 * Singleton instance of GameSessionService.
 * Can be swapped with WebSocketGameSessionService or SupabaseGameSessionService
 * simply by updating the exported instance.
 */
export const gameSessionService = new LocalGameSessionService();
