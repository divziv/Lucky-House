import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ClaimRequest,
  GameConfig,
  GameMode,
  GameState,
  Player,
  PrizeCategory,
} from '../types/tambola';
import {
  callNextNumber,
  createNewGame,
  getDefaultGameConfig,
  isPlayerEligibleForCategory,
  isPrizeAvailable,
  recordWinner,
  verifyCardAchievement,
  PRIZE_LABELS,
} from '../services/gameEngine';
import { generatePlayerCard } from '../services/cardGenerator';
import { voiceService } from '../services/voiceService';
import { soundFX } from '../utils/soundUtils';
import {
  clearActiveGame,
  loadActiveGame,
  saveActiveGame,
} from '../services/storageService';
import { gameSessionService } from '../services/gameSessionService';
import { ToastMessage } from '../components/common/Toast';
import { triggerWinnerCelebration } from '../utils/celebrationUtils';

interface GameContextType {
  gameState: GameState | null;
  isCalling: boolean;
  justPoppedNumber: number | null;
  isMarkedOnBoard: boolean;
  activePlayer: Player | null;
  toasts: ToastMessage[];
  hasResumeGame: boolean;
  dismissPopEffect: () => void;
  dismissToast: (id: string) => void;
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  startNewSetup: (mode?: GameMode) => void;
  startGame: (config: GameConfig) => void;
  callNext: () => void;
  resumeAfterPause: () => void;
  recordManualWinner: (
    playerName: string,
    category: PrizeCategory,
    playerId?: string,
    ticketNumber?: number
  ) => void;
  verifyPendingClaim: (claim: ClaimRequest) => void;
  rejectPendingClaim: (claim: ClaimRequest) => void;
  submitPlayerClaim: (playerId: string, category: PrizeCategory) => void;
  addVirtualPlayer: (name?: string) => Player | null;
  setActivePlayerById: (playerId: string | null) => void;
  endGame: () => void;
  resetGame: () => void;
  toggleVoice: () => void;
  toggleSound: () => void;
  repeatCurrentVoice: () => void;
  speakRulesNow: () => void;
  resumeSavedGame: () => void;
  dismissResume: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [justPoppedNumber, setJustPoppedNumber] = useState<number | null>(null);
  const [isMarkedOnBoard, setIsMarkedOnBoard] = useState<boolean>(false);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hasResumeGame, setHasResumeGame] = useState<boolean>(false);

  const dismissPopEffect = useCallback(() => {
    setJustPoppedNumber(null);
    setIsMarkedOnBoard(false);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastMessage['type'], title: string, description?: string) => {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        description,
      };
      setToasts((prev) => [...prev.slice(-4), newToast]);
      setTimeout(() => {
        dismissToast(newToast.id);
      }, 4500);
    },
    [dismissToast]
  );

  // Check saved game on mount
  useEffect(() => {
    const saved = loadActiveGame();
    if (saved && saved.status !== 'finished' && saved.calledNumbers.length > 0) {
      setHasResumeGame(true);
    }
  }, []);

  // Listen to remote / multi-tab session events
  useEffect(() => {
    const unsubState = gameSessionService.onStateChange((incomingState) => {
      setGameState((current) => {
        // If a new winner was added, trigger confetti and clapping celebration!
        if (incomingState.winners.length > (current?.winners.length || 0)) {
          const latestWinner = incomingState.winners[incomingState.winners.length - 1];
          triggerWinnerCelebration(latestWinner?.categoryName, latestWinner?.playerName);
        }

        if (!current || incomingState.calledNumbers.length >= current.calledNumbers.length) {
          // If a new number is generated, trigger the pop up effect for virtual players too
          if (
            incomingState.currentNumber !== null &&
            incomingState.currentNumber !== current?.currentNumber
          ) {
            setJustPoppedNumber(incomingState.currentNumber);
            setIsMarkedOnBoard(false);
            if (incomingState.config.soundSettings.enabled) {
              soundFX.playNumberPop(incomingState.config.soundSettings.volume);
              setTimeout(() => {
                setIsMarkedOnBoard(true);
                soundFX.playBoardStamp(incomingState.config.soundSettings.volume * 0.85);
              }, 700);
            }
          }
          return incomingState;
        }
        return current;
      });
    });

    const unsubClaim = gameSessionService.onClaimSubmitted((claim) => {
      setGameState((current) => {
        if (!current) return null;
        if (current.pendingClaims.some((c) => c.id === claim.id)) return current;
        showToast(
          'info',
          `Claim Received: ${claim.playerName}`,
          `Claiming ${PRIZE_LABELS[claim.category]} - Waiting for host verification.`
        );
        soundFX.playPauseNotice();
        return {
          ...current,
          pendingClaims: [...current.pendingClaims, claim],
        };
      });
    });

    const unsubPlayer = gameSessionService.onPlayerJoined((newPlayer) => {
      setGameState((current) => {
        if (!current) return null;
        if (current.players.some((p) => p.id === newPlayer.id)) return current;
        showToast('info', 'Player Joined', `${newPlayer.name} joined with Ticket #${newPlayer.card.ticketNumber}`);
        return {
          ...current,
          players: [...current.players, newPlayer],
        };
      });
    });

    return () => {
      unsubState();
      unsubClaim();
      unsubPlayer();
    };
  }, [showToast]);

  // Persist game state whenever updated
  useEffect(() => {
    if (gameState) {
      saveActiveGame(gameState);
    }
  }, [gameState]);

  const resumeSavedGame = () => {
    const saved = loadActiveGame();
    if (saved) {
      setGameState(saved);
      gameSessionService.initHost(saved.gameCode, saved);
      voiceService.updateSettings(saved.config.voiceSettings);
      setHasResumeGame(false);
      showToast('success', 'Game Resumed', `Continuing session ${saved.gameCode}`);
    }
  };

  const dismissResume = () => {
    clearActiveGame();
    setHasResumeGame(false);
  };

  const startNewSetup = (mode: GameMode = 'physical') => {
    clearActiveGame();
    const config = getDefaultGameConfig(mode);
    const initial = createNewGame(config);
    setGameState(initial);
    setActivePlayer(null);
  };

  const startGame = (config: GameConfig) => {
    const initial = createNewGame(config);
    setGameState(initial);
    gameSessionService.initHost(initial.gameCode, initial);
    voiceService.updateSettings(config.voiceSettings);

    showToast('success', 'Game Started', `Lucky House session ${initial.gameCode} is live!`);

    if (config.voiceSettings.enabled) {
      setTimeout(() => {
        voiceService.speakRules(config, () => {
          setGameState((prev) => (prev ? { ...prev, hasAnnouncedRules: true } : null));
        });
      }, 500);
    }
  };

  const speakRulesNow = () => {
    if (gameState) {
      voiceService.speakRules(gameState.config);
    }
  };

  const callNext = () => {
    if (!gameState || isCalling) return;
    if (gameState.status === 'firstFivePaused') return;
    const totalCount = gameState.config.numberRange.end - gameState.config.numberRange.start + 1;
    if (gameState.calledNumbers.length >= totalCount) {
      showToast('warning', 'Number Pool Exhausted', 'All numbers have been drawn.');
      return;
    }

    setIsCalling(true);
    const { nextState, called } = callNextNumber(gameState);

    if (called !== null) {
      // 1. That number pops up on the screen with sound effect
      setJustPoppedNumber(called);
      setIsMarkedOnBoard(false);

      if (nextState.config.soundSettings.enabled) {
        soundFX.playNumberPop(nextState.config.soundSettings.volume);
      }

      // 2. And then mark it on the board with stamp sound & animation
      setTimeout(() => {
        setIsMarkedOnBoard(true);
        setGameState(nextState);
        gameSessionService.broadcastState(nextState);

        if (nextState.config.soundSettings.enabled) {
          soundFX.playBoardStamp(nextState.config.soundSettings.volume * 0.85);
        }

        if (nextState.status === 'firstFivePaused') {
          if (nextState.config.soundSettings.enabled) {
            setTimeout(() => soundFX.playPauseNotice(), 600);
          }
          showToast(
            'warning',
            '5 Numbers Called!',
            'Game paused so players can check their tickets for Fast Five.'
          );
        }

        // 3. Voice announcement sequence as number marks on the board
        if (nextState.config.voiceSettings.enabled) {
          setTimeout(() => {
            voiceService.speakNumber(called, nextState.config.numberRange, () => {
              setIsCalling(false);
            });
          }, 120);
        } else {
          setTimeout(() => setIsCalling(false), 300);
        }
      }, 700);
    } else {
      setIsCalling(false);
    }
  };

  const resumeAfterPause = () => {
    if (!gameState) return;
    const updated: GameState = {
      ...gameState,
      status: 'playing',
    };
    setGameState(updated);
    gameSessionService.broadcastState(updated);
    showToast('info', 'Game Resumed', 'Continuing number calls.');
  };

  const recordManualWinner = (
    playerName: string,
    category: PrizeCategory,
    playerId?: string,
    ticketNumber?: number
  ) => {
    if (!gameState) return;

    if (!isPrizeAvailable(gameState, category)) {
      showToast('error', 'Prize Unavailable', `All spots for ${PRIZE_LABELS[category]} are full.`);
      return;
    }

    const updated = recordWinner(gameState, playerName, category, playerId, ticketNumber);
    setGameState(updated);
    gameSessionService.broadcastState(updated);

    // Trigger confetti animation and applause/claps sound effect!
    triggerWinnerCelebration(PRIZE_LABELS[category], playerName);

    showToast(
      'success',
      'Winner Verified!',
      `${playerName} won ${PRIZE_LABELS[category]} on number #${updated.currentNumber}`
    );

    if (updated.status === 'allPrizesClaimed') {
      showToast(
        'info',
        'All Current Winners Identified',
        'All configured prize spots have been claimed. You may continue or end game.'
      );
    }
  };

  const verifyPendingClaim = (claim: ClaimRequest) => {
    if (!gameState) return;
    recordManualWinner(claim.playerName, claim.category, claim.playerId, claim.ticketNumber);
  };

  const rejectPendingClaim = (claim: ClaimRequest) => {
    if (!gameState) return;
    const updatedClaims = gameState.pendingClaims.filter((c) => c.id !== claim.id);
    const updated: GameState = {
      ...gameState,
      pendingClaims: updatedClaims,
    };
    setGameState(updated);
    gameSessionService.broadcastState(updated);
    showToast('warning', 'Claim Rejected', `Claim by ${claim.playerName} was rejected.`);
  };

  const submitPlayerClaim = (playerId: string, category: PrizeCategory) => {
    if (!gameState) return;
    const player = gameState.players.find((p) => p.id === playerId);
    if (!player) return;

    const eligibility = isPlayerEligibleForCategory(player, category, gameState.config);
    if (!eligibility.eligible) {
      showToast('error', 'Ineligible Claim', eligibility.reason || 'Not eligible for this prize.');
      return;
    }

    const check = verifyCardAchievement(player.card, category, gameState.calledNumbers);
    if (!check.completed) {
      showToast(
        'error',
        'Incomplete Claim',
        `You have marked ${check.matchedCount} of ${check.targetCount} required numbers.`
      );
      return;
    }

    const claim: ClaimRequest = {
      id: `claim-${Date.now()}-${playerId}`,
      playerId,
      playerName: player.name,
      ticketNumber: player.card.ticketNumber,
      category,
      timestamp: Date.now(),
      status: 'pending',
    };

    gameSessionService.submitClaim(claim);
    showToast(
      'success',
      'Claim Submitted!',
      `Your claim for ${PRIZE_LABELS[category]} was sent to the host for verification.`
    );
  };

  const addVirtualPlayer = (name?: string): Player | null => {
    if (!gameState) return null;
    const count = gameState.players.length + 1;
    const playerName = name || `Player ${count}`;
    const newCard = generatePlayerCard(count, gameState.config.numberRange, count - 1);

    const newPlayer: Player = {
      id: `player-${Date.now()}-${count}`,
      name: playerName,
      card: newCard,
      wonCategories: [],
      fullHouseEligible: true,
      connected: true,
      joinedAt: Date.now(),
    };

    const updated: GameState = {
      ...gameState,
      players: [...gameState.players, newPlayer],
    };
    setGameState(updated);
    gameSessionService.broadcastState(updated);
    return newPlayer;
  };

  const setActivePlayerById = (playerId: string | null) => {
    if (!playerId || !gameState) {
      setActivePlayer(null);
      return;
    }
    const found = gameState.players.find((p) => p.id === playerId);
    setActivePlayer(found || null);
  };

  const endGame = () => {
    if (!gameState) return;
    const finished: GameState = {
      ...gameState,
      status: 'finished',
    };
    setGameState(finished);
    gameSessionService.broadcastState(finished);
    voiceService.stopSpeaking();
  };

  const resetGame = () => {
    if (!gameState) return;
    const restarted = createNewGame(gameState.config);
    const refreshedPlayers: Player[] = gameState.players.map((p, idx) => ({
      ...p,
      card: generatePlayerCard(idx + 1, gameState.config.numberRange, idx),
      wonCategories: [],
      fullHouseEligible: true,
    }));
    restarted.players = refreshedPlayers;
    setGameState(restarted);
    gameSessionService.broadcastState(restarted);
    showToast('info', 'Game Restarted', 'Numbers reshuffled and tickets refreshed.');
  };

  const toggleVoice = () => {
    if (!gameState) return;
    const newVoiceEnabled = !gameState.config.voiceSettings.enabled;
    const updatedConfig: GameConfig = {
      ...gameState.config,
      voiceSettings: {
        ...gameState.config.voiceSettings,
        enabled: newVoiceEnabled,
      },
    };
    voiceService.updateSettings({ enabled: newVoiceEnabled });
    setGameState({
      ...gameState,
      config: updatedConfig,
    });
    showToast('info', newVoiceEnabled ? 'Voice Caller Enabled' : 'Voice Caller Muted');
  };

  const toggleSound = () => {
    if (!gameState) return;
    const newSoundEnabled = !gameState.config.soundSettings.enabled;
    const updatedConfig: GameConfig = {
      ...gameState.config,
      soundSettings: {
        ...gameState.config.soundSettings,
        enabled: newSoundEnabled,
      },
    };
    setGameState({
      ...gameState,
      config: updatedConfig,
    });
    showToast('info', newSoundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted');
  };

  const repeatCurrentVoice = () => {
    if (gameState && gameState.currentNumber !== null) {
      voiceService.speakNumber(gameState.currentNumber, gameState.config.numberRange);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        isCalling,
        justPoppedNumber,
        isMarkedOnBoard,
        activePlayer,
        toasts,
        hasResumeGame,
        dismissPopEffect,
        dismissToast,
        showToast,
        startNewSetup,
        startGame,
        callNext,
        resumeAfterPause,
        recordManualWinner,
        verifyPendingClaim,
        rejectPendingClaim,
        submitPlayerClaim,
        addVirtualPlayer,
        setActivePlayerById,
        endGame,
        resetGame,
        toggleVoice,
        toggleSound,
        repeatCurrentVoice,
        speakRulesNow,
        resumeSavedGame,
        dismissResume,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
