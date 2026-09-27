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
    <div className="w-full bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] rounded-2xl p-5 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D6E4F0] dark:border-[#26354A]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#1565C0] dark:text-[#64B5F6]" />
          <h2 className="text-sm font-bold text-[#17324D] dark:text-[#F8FAFC] tracking-wide uppercase">
            Prizes &amp; Winners
          </h2>
        </div>

        {/* Claim / Add Winner Button: Secondary White with Blue border */}
        <Button variant="secondary" size="sm" onClick={onOpenManualClaim}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Winner</span>
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const maxAllowed = config.prizes[cat];
          if (maxAllowed <= 0 && cat !== 'fastFive') return null;

          const catWinners = winners.filter((w) => w.category === cat);
          const currentCount = catWinners.length;
          const isClosed = currentCount >= maxAllowed;

          return (
            <div
              key={cat}
              className={`p-3.5 rounded-xl border transition-all ${
                isClosed
                  ? 'bg-[#F5FAFF] dark:bg-[#172033]/60 border-[#D6E4F0] dark:border-[#26354A]'
                  : 'bg-white dark:bg-[#111827] border-[#D6E4F0] dark:border-[#26354A] hover:border-[#1976D2]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1565C0] dark:text-[#64B5F6]">
                    🏆 {PRIZE_LABELS[cat]}
                  </span>
                  {isClosed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#66BB6A] bg-[#E8F5E9] dark:bg-[#1B5E20]/40 px-2 py-0.5 rounded-md border border-[#C8E6C9] dark:border-[#2E7D32]/50">
                      <CheckCircle2 className="w-3 h-3" />
                      Closed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#1565C0] dark:text-[#64B5F6] bg-[#E3F2FD] dark:bg-[#172033] px-2 py-0.5 rounded-md">
                      {maxAllowed - currentCount} spot{maxAllowed - currentCount > 1 ? 's' : ''} left
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono-nums font-bold text-[#607D8B] dark:text-[#B0BEC5]">
                  {currentCount} / {maxAllowed}
                </div>
              </div>

              {/* Winner Cards matching specification: Name, Ticket, ✓ Winner Verified */}
              {catWinners.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-[#D6E4F0]/60 dark:border-[#26354A]/60">
                  {catWinners.map((winner, idx) => (
                    <div
                      key={winner.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A] text-xs flex flex-col gap-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#17324D] dark:text-[#F8FAFC] text-sm">
                          {winner.playerName}
                        </span>
                        {winner.ticketNumber && (
                          <span className="text-[11px] font-semibold text-[#1565C0] dark:text-[#64B5F6] font-mono-nums">
                            Ticket #{winner.ticketNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-[#2E7D32] dark:text-[#66BB6A] font-bold flex items-center gap-1">
                          ✓ Winner Verified
                        </span>
                        <span className="text-[#607D8B] dark:text-[#B0BEC5] font-mono-nums">
                          Called #{winner.numberWhenWon}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#607D8B] dark:text-[#B0BEC5] italic pt-1">
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
