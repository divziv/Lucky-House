import React from 'react';
import { useGame } from '../context/GameContext';
import { PlayerTicketCard } from '../components/player/PlayerTicketCard';
import { CallHistory } from '../components/game/CallHistory';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { NumberPopModal } from '../components/game/NumberPopModal';
import { getNumberAnnouncement } from '../utils/numberCallPhrases';
import { PrizeCategory } from '../types/tambola';
import { ArrowLeft, Crown } from 'lucide-react';

export interface PlayerGameProps {
  onLeave: () => void;
}

export const PlayerGame: React.FC<PlayerGameProps> = ({ onLeave }) => {
  const {
    gameState,
    activePlayer,
    submitPlayerClaim,
    justPoppedNumber,
    isMarkedOnBoard,
    dismissPopEffect,
  } = useGame();

  if (!gameState || !activePlayer) {
    return (
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-100 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 mb-2">No Active Player Ticket</h2>
        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6">
          You are not currently connected to an active ticket in this session.
        </p>
        <Button variant="gold" onClick={onLeave}>
          Return Home
        </Button>
      </div>
    );
  }

  const handleClaim = (cat: PrizeCategory) => {
    submitPlayerClaim(activePlayer.id, cat);
  };

  const totalPool = gameState.config.numberRange.end - gameState.config.numberRange.start + 1;
  const currentAnnouncement = gameState.currentNumber
    ? getNumberAnnouncement(
        gameState.currentNumber,
        gameState.config.numberRange,
        gameState.config.voiceSettings.callingStyle
      )
    : null;

  const isTopOfHouse = gameState.currentNumber === gameState.config.numberRange.end;

  return (
    <div className="min-h-screen theme-bg-page theme-text-primary flex flex-col justify-between transition-colors">
      {/* Player Navigation Header */}
      <header className="w-full theme-bg-card border-b theme-border px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs backdrop-blur-md transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onLeave}
              className="p-1.5 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Leave Room"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs uppercase theme-text-secondary font-semibold block leading-none">
                Room
              </span>
              <span className="text-base font-black theme-text-accent font-mono-nums">
                {gameState.gameCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <div className="text-xs theme-text-secondary">Playing As</div>
              <div className="text-sm font-bold theme-text-primary">{activePlayer.name}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Caller Live Status Banner */}
        <div className="p-4 sm:p-5 rounded-3xl theme-bg-card border theme-border flex items-center justify-between shadow-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-mono-nums font-black shadow-lg shadow-amber-400/30">
              <span className="text-2xl sm:text-3xl leading-none">
                {gameState.currentNumber !== null ? gameState.currentNumber : '--'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-tight">Current</span>
            </div>

            <div>
              <div className="text-xs theme-text-accent uppercase font-bold tracking-wider flex items-center gap-1.5">
                {isTopOfHouse && <Crown className="w-3.5 h-3.5" />}
                {isTopOfHouse ? 'TOP OF THE HOUSE' : 'Live Draw'}
              </div>
              <div className="text-base sm:text-lg font-bold theme-text-primary mt-0.5">
                {currentAnnouncement ? currentAnnouncement.primaryDescription : 'Waiting for call...'}
              </div>
              {currentAnnouncement && (
                <div className="text-xs theme-text-secondary font-mono-nums">
                  {currentAnnouncement.spokenPhrases[1] || ''}
                </div>
              )}
            </div>
          </div>

          <div className="text-right text-xs theme-text-secondary hidden sm:block font-mono-nums">
            <div>
              Numbers Called: <strong className="theme-text-accent">{gameState.calledNumbers.length}</strong>
            </div>
            <div>
              Remaining: <strong>{totalPool - gameState.calledNumbers.length}</strong>
            </div>
          </div>
        </div>

        {/* First 5 pause banner */}
        {gameState.status === 'firstFivePaused' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400 text-center animate-call-pop">
            <span className="font-bold text-amber-400 dark:text-amber-300 light:text-amber-700 block mb-1">
              5 Numbers Called!
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              Check your ticket now. If you have 5 numbers marked, claim Fast Five!
            </span>
          </div>
        )}

        {/* Player Digital Ticket Card */}
        <PlayerTicketCard
          card={activePlayer.card}
          playerName={activePlayer.name}
          calledNumbers={gameState.calledNumbers}
          currentNumber={gameState.currentNumber}
          config={gameState.config}
          wonCategories={activePlayer.wonCategories}
          fullHouseEligible={activePlayer.fullHouseEligible}
          onClaimPrize={handleClaim}
          interactiveMarks={true}
        />

        {/* Recent Called Numbers Bar */}
        <CallHistory
          calledNumbers={gameState.calledNumbers}
          currentNumber={gameState.currentNumber}
        />
      </main>

      {/* Pop Up Number Animation Overlay Modal */}
      <NumberPopModal
        number={justPoppedNumber}
        numberRange={gameState.config.numberRange}
        callingStyle={gameState.config.voiceSettings.callingStyle}
        isMarkedOnBoard={isMarkedOnBoard}
        onAnimationEnd={dismissPopEffect}
      />

      <footer className="w-full border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 py-4 px-6 bg-slate-950 dark:bg-slate-950 light:bg-white text-xs text-slate-500 text-center transition-colors">
        Tap numbers on your ticket to highlight manually or let automatic tracking mark called numbers.
      </footer>
    </div>
  );
};
