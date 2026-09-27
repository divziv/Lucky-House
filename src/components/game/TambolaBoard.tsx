import React from 'react';
import { NumberRange } from '../../types/tambola';
import { generateOrderedNumberBoard } from '../../utils/numberRangeUtils';
import { Check } from 'lucide-react';

export interface TambolaBoardProps {
  numberRange: NumberRange;
  calledNumbers: number[];
  currentNumber: number | null;
  justCalledNumber?: number | null;
  onNumberClick?: (num: number) => void;
  className?: string;
  isPresentationMode?: boolean;
}

export const TambolaBoard: React.FC<TambolaBoardProps> = ({
  numberRange,
  calledNumbers,
  currentNumber,
  justCalledNumber,
  onNumberClick,
  className = '',
  isPresentationMode = false,
}) => {
  const calledSet = React.useMemo(() => new Set(calledNumbers), [calledNumbers]);

  const orderedBoard = React.useMemo(
    () => generateOrderedNumberBoard(numberRange.start, numberRange.end),
    [numberRange.start, numberRange.end]
  );

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-6 shadow-md transition-colors bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] ${className}`}
    >
      {/* Board Header & Legend */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 mb-4 border-b border-[#D6E4F0] dark:border-[#26354A] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1565C0] dark:bg-[#42A5F5]" />
          <h2 className="text-sm sm:text-base font-bold text-[#17324D] dark:text-[#F8FAFC] tracking-wide uppercase">
            Tambola Board ({numberRange.start}–{numberRange.end})
          </h2>
        </div>

        {/* Legend conforming to White and Blue specifications */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-[#607D8B] dark:text-[#B0BEC5]">
            <div className="w-3.5 h-3.5 rounded bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A]" />
            <span className="hidden sm:inline">Uncalled</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1976D2] dark:text-[#64B5F6] font-semibold">
            <div className="w-3.5 h-3.5 rounded bg-[#1976D2] text-white flex items-center justify-center text-[10px]">
              ✓
            </div>
            <span className="hidden sm:inline">Called</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0D47A1] dark:text-[#42A5F5] font-bold">
            <div className="w-3.5 h-3.5 rounded bg-[#0D47A1] border-2 border-[#64B5F6] shadow-sm" />
            <span>Current</span>
          </div>
        </div>
      </div>

      {/* Grid of Numbers: Strict ascending numerical order */}
      <div
        className={`grid grid-cols-10 gap-1.5 sm:gap-2 select-none p-2 sm:p-3 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0]/60 dark:border-[#26354A]/60 ${
          isPresentationMode ? 'gap-2.5 sm:gap-3 p-4' : ''
        }`}
      >
        {orderedBoard.map((num) => {
          const isCalled = calledSet.has(num);
          const isCurrent = currentNumber === num;
          const isJustStamped = justCalledNumber === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onNumberClick && onNumberClick(num)}
              aria-label={`Number ${num}${isCurrent ? ', currently called' : isCalled ? ', already called' : ', uncalled'}`}
              className={`aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center relative font-mono-nums font-bold transition-all duration-150 ${
                isPresentationMode ? 'text-base sm:text-xl lg:text-2xl' : 'text-xs sm:text-sm md:text-base'
              } ${
                isJustStamped
                  ? 'animate-board-stamp bg-[#0D47A1] text-white ring-4 ring-[#64B5F6] z-20 shadow-xl'
                  : isCurrent
                  ? 'bg-[#0D47A1] text-white border-2 border-[#64B5F6] shadow-lg shadow-blue-900/40 scale-105 z-10 animate-pulse-blue ring-2 ring-[#1976D2]'
                  : isCalled
                  ? 'bg-[#1976D2] text-white border border-[#1565C0] shadow-sm hover:brightness-110'
                  : 'bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] text-[#17324D] dark:text-[#B0BEC5] hover:bg-[#E3F2FD] dark:hover:bg-[#172033] hover:border-[#1976D2]'
              }`}
            >
              <span>{num}</span>
              {isCalled && !isCurrent && (
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/90 absolute bottom-0.5 sm:bottom-1 stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
