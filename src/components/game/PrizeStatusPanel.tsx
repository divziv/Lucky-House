import React from 'react';
import { GameConfig, PrizeCategory, WinnerRecord } from '../../types/tambola';
import { PRIZE_LABELS } from '../../services/gameEngine';
import { Button } from '../common/Button';
import { Trophy, Plus, CheckCircle2 } from 'lucide-react';

export interface PrizeStatusPanelProps {
  config: GameConfig;
  winners: WinnerRecord[];
  onOpenManualClaim: () => void;
}

export const PrizeStatusPanel: React.FC<PrizeStatusPanelProps> = ({
  config,
  winners,
  onOpenManualClaim,
}) => {
  const categories = Object.keys(config.prizes) as PrizeCategory[];

  return (
    <div className="w-full bg-white dark:bg-[#171717] border border-[#D6E4F0] dark:border-[#4A3A12] rounded-2xl p-5 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D6E4F0] dark:border-[#4A3A12]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#1565C0] dark:text-[#FFD54F]" />
          <h2 className="text-sm font-bold tracking-wide uppercase">
            Prizes &amp; Winners
          </h2>
        </div>

        {/* Claim / Add Winner Button */}
        <Button variant="secondary" size="sm" onClick={onOpenManualClaim}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Winner</span>
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const prizeItem = config.prizes[cat];
          // If category is not enabled or has 0 winners, DO NOT show in active game!
          if (!prizeItem || !prizeItem.enabled || prizeItem.winners <= 0) return null;

          const maxAllowed = prizeItem.winners;
          const catWinners = winners.filter((w) => w.category === cat);
          const currentCount = catWinners.length;
          const isClosed = currentCount >= maxAllowed;

          return (
            <div
              key={cat}
              className={`p-3.5 rounded-xl border transition-all ${
                isClosed
                  ? 'bg-slate-50 dark:bg-[#202020] border-slate-200 dark:border-amber-900/30'
                  : 'bg-white dark:bg-[#171717] border-slate-200 dark:border-[#4A3A12] hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1565C0] dark:text-[#FFD54F]">
                    🏆 {PRIZE_LABELS[cat]}
                  </span>
                  {isClosed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#66BB6A] bg-[#E8F5E9] dark:bg-[#1B5E20]/40 px-2 py-0.5 rounded-md border border-[#C8E6C9] dark:border-[#2E7D32]/50">
                      <CheckCircle2 className="w-3 h-3" />
                      Closed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#1565C0] dark:text-[#FFD54F] bg-[#E3F2FD] dark:bg-[#261E0A] px-2 py-0.5 rounded-md">
                      {maxAllowed - currentCount} spot{maxAllowed - currentCount > 1 ? 's' : ''} left
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono-nums font-bold opacity-75">
                  {currentCount} / {maxAllowed}
                </div>
              </div>

              {/* Winner Cards matching specification: Name, Ticket, ✓ Winner Verified */}
              {catWinners.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                  {catWinners.map((winner) => (
                    <div
                      key={winner.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0B0B] border border-slate-200 dark:border-[#4A3A12] text-xs flex flex-col gap-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">
                          {winner.playerName}
                        </span>
                        {winner.ticketNumber && (
                          <span className="text-[11px] font-semibold text-[#1565C0] dark:text-[#FFD54F] font-mono-nums">
                            Ticket #{winner.ticketNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-[#2E7D32] dark:text-[#66BB6A] font-bold flex items-center gap-1">
                          ✓ Winner Verified
                        </span>
                        <span className="opacity-75 font-mono-nums">
                          Called #{winner.numberWhenWon}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs opacity-60 italic pt-1">
                  No verified winners yet
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
