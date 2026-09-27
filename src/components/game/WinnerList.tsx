import React from 'react';
import { WinnerRecord } from '../../types/tambola';
import { Award, Hash } from 'lucide-react';

export interface WinnerListProps {
  winners: WinnerRecord[];
}

export const WinnerList: React.FC<WinnerListProps> = ({ winners }) => {
  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] rounded-2xl p-5 shadow-sm transition-colors">
      <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-[#D6E4F0] dark:border-[#26354A]">
        <Award className="w-4 h-4 text-[#1565C0] dark:text-[#64B5F6]" />
        <h2 className="text-sm font-bold text-[#17324D] dark:text-[#F8FAFC] tracking-wide uppercase">
          Winner Log ({winners.length})
        </h2>
      </div>

      {winners.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#607D8B] dark:text-[#B0BEC5]">
          No winners recorded yet. When claims are verified, they will appear here.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {winners.map((winner, idx) => (
            <div
              key={winner.id}
              className="p-3 rounded-xl bg-[#F5FAFF] dark:bg-[#172033]/60 border border-[#D6E4F0] dark:border-[#26354A] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1565C0] text-white font-bold font-mono-nums flex items-center justify-center text-xs shadow-xs">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-[#17324D] dark:text-[#F8FAFC] text-sm">{winner.playerName}</div>
                  <div className="text-[#1565C0] dark:text-[#64B5F6] font-semibold text-[11px] mt-0.5">
                    🏆 {winner.categoryName}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono-nums text-[#607D8B] dark:text-[#B0BEC5]">
                <div className="text-[11px] flex items-center gap-1 justify-end">
                  <Hash className="w-3 h-3 text-[#1976D2]" />
                  <span>Call #{winner.callCountWhenWon}</span>
                </div>
                {winner.numberWhenWon > 0 && (
                  <div className="text-[10px] text-[#2E7D32] dark:text-[#66BB6A] font-semibold">
                    ✓ Verified on #{winner.numberWhenWon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
