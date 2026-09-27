import React from 'react';
import { History } from 'lucide-react';

export interface CallHistoryProps {
  calledNumbers: number[];
  currentNumber: number | null;
}

export const CallHistory: React.FC<CallHistoryProps> = ({ calledNumbers, currentNumber }) => {
  const reversed = [...calledNumbers].reverse();

  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] rounded-2xl p-4 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#D6E4F0] dark:border-[#26354A] text-xs">
        <div className="flex items-center gap-2 text-[#1565C0] dark:text-[#64B5F6] font-bold uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          <span>Call History (Recent First)</span>
        </div>
        <span className="text-[#607D8B] dark:text-[#B0BEC5] font-mono-nums">
          Total: <strong className="text-[#1565C0] dark:text-[#64B5F6] font-bold">{calledNumbers.length}</strong>
        </span>
      </div>

      {reversed.length === 0 ? (
        <div className="text-xs text-[#607D8B] dark:text-[#B0BEC5] py-3 text-center">
          No numbers called yet. Click &ldquo;Next Number&rdquo; to start.
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {reversed.map((num, idx) => {
            const isLatest = num === currentNumber && idx === 0;
            const callOrder = calledNumbers.length - idx;
            return (
              <div
                key={`${num}-${callOrder}`}
                className={`shrink-0 flex flex-col items-center justify-center w-11 h-12 rounded-xl font-mono-nums border transition-all ${
                  isLatest
                    ? 'bg-[#1565C0] text-white font-black border-[#1976D2] shadow-md shadow-blue-800/30 scale-105'
                    : 'bg-[#F5FAFF] dark:bg-[#172033] border-[#D6E4F0] dark:border-[#26354A] text-[#17324D] dark:text-[#F8FAFC] font-bold'
                }`}
              >
                <span className="text-[10px] opacity-70">#{callOrder}</span>
                <span className="text-sm font-extrabold leading-none">{num}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
