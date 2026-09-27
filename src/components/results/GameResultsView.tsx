import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameState, PrizeCategory } from '../../types/tambola';
import { PRIZE_LABELS } from '../../services/gameEngine';
import { soundFX } from '../../utils/soundUtils';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { Trophy, Award, RotateCcw, Plus, Copy, Check, Printer, Home, Sparkles } from 'lucide-react';

export interface GameResultsViewProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewGame: () => void;
  onGoHome: () => void;
}

export const GameResultsView: React.FC<GameResultsViewProps> = ({
  state,
  onPlayAgain,
  onNewGame,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);
  const totalPool = state.config.numberRange.end - state.config.numberRange.start + 1;

  useEffect(() => {
    soundFX.playWinFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#818cf8', '#ec4899', '#10b981'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch {}
  }, []);

  const categories = Object.keys(state.config.prizes) as PrizeCategory[];

  const handleCopySummary = () => {
    let summary = `🎉 LUCKY HOUSE - TAMBOLA TIME RESULTS 🎉\n`;
    summary += `Tagline: Tambola Time - Call. Mark. Claim. Celebrate!\n\n`;
    summary += `Game Code: ${state.gameCode}\n`;
    summary += `Number Range: ${state.config.numberRange.start} to ${state.config.numberRange.end}\n`;
    summary += `Total Numbers Called: ${state.calledNumbers.length} / ${totalPool}\n\n`;
    summary += `🏆 OFFICIAL PRIZE WINNERS:\n`;

    categories.forEach((cat) => {
      const catWinners = state.winners.filter((w) => w.category === cat);
      if (catWinners.length > 0) {
        summary += `• ${PRIZE_LABELS[cat]}: `;
        summary += catWinners
          .map((w) => `${w.playerName} (number #${w.numberWhenWon})`)
          .join(', ');
        summary += `\n`;
      }
    });

    summary += `\nCalled Numbers: ${state.calledNumbers.join(', ')}\n`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 w-full">
      {/* Top Nav with Theme Toggle */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black font-heading text-white dark:text-white light:text-slate-900">
            Lucky <span className="text-amber-500">House</span>
          </span>
          <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 light:text-amber-600 hidden sm:inline">
            Tambola Time - Call. Mark. Claim. Celebrate!
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onGoHome}>
            <Home className="w-3.5 h-3.5" />
            Home
          </Button>
        </div>
      </div>

      {/* Celebration Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-100 border border-amber-500/30 text-amber-500 dark:text-amber-400 light:text-amber-600 mb-3 shadow-lg shadow-amber-500/10">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 font-heading tracking-tight">
          Game Complete!
        </h1>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm mt-1 max-w-lg mx-auto">
          Tambola Time celebration! Congratulations to all the winners of session{' '}
          <strong className="text-amber-500 dark:text-amber-400 light:text-amber-600 font-mono-nums">{state.gameCode}</strong>.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase font-semibold">Game Code</div>
          <div className="text-xl font-black text-amber-500 dark:text-amber-400 light:text-amber-600 font-mono-nums mt-1">
            {state.gameCode}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase font-semibold">Number Range</div>
          <div className="text-xl font-black text-white dark:text-white light:text-slate-900 font-mono-nums mt-1">
            {state.config.numberRange.start} to {state.config.numberRange.end}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase font-semibold">Numbers Called</div>
          <div className="text-xl font-black text-indigo-500 dark:text-indigo-400 light:text-indigo-600 font-mono-nums mt-1">
            {state.calledNumbers.length} / {totalPool}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase font-semibold">Total Winners</div>
          <div className="text-xl font-black text-emerald-500 dark:text-emerald-400 light:text-emerald-600 font-mono-nums mt-1">
            {state.winners.length}
          </div>
        </div>
      </div>

      {/* Winners Breakdown by Category */}
      <div className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 transition-colors">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400 light:text-amber-600" />
            <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider font-heading">
              Official Prize Winners
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopySummary}>
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:inline-flex">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catWinners = state.winners.filter((w) => w.category === cat);
            const isConfigured = state.config.prizes[cat] > 0;
            if (!isConfigured && catWinners.length === 0) return null;

            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-500 dark:text-amber-400 light:text-amber-700">
                    {PRIZE_LABELS[cat]}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 light:text-slate-500 font-mono-nums">
                    {catWinners.length} / {state.config.prizes[cat]} won
                  </span>
                </div>

                {catWinners.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    {catWinners.map((winner, idx) => (
                      <div
                        key={winner.id}
                        className="p-2.5 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between text-xs shadow-sm"
                      >
                        <span className="font-bold text-white dark:text-white light:text-slate-900 text-sm">
                          {idx + 1}. {winner.playerName}
                        </span>
                        <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono-nums">
                          Won on number #{winner.numberWhenWon}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    Unclaimed prize
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" size="lg" onClick={onGoHome}>
          <Home className="w-4 h-4" />
          Return Home
        </Button>

        <Button variant="outline" size="lg" onClick={onPlayAgain}>
          <RotateCcw className="w-4 h-4" />
          Play Again (Same Players)
        </Button>

        <Button variant="gold" size="lg" onClick={onNewGame}>
          <Plus className="w-4 h-4" />
          Start New Game
        </Button>
      </div>
    </div>
  );
};
