import React from 'react';
import { NumberRange } from '../../types/tambola';
import { generateOrderedNumberBoard } from '../../utils/numberRangeUtils';
import { useTheme } from '../../context/ThemeContext';
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
  const { theme } = useTheme();
  const calledSet = React.useMemo(() => new Set(calledNumbers), [calledNumbers]);

  const orderedBoard = React.useMemo(
    () => generateOrderedNumberBoard(numberRange.start, numberRange.end),
    [numberRange.start, numberRange.end]
  );

  const isBlackGold = theme === 'black-gold';
  const isWhitePink = theme === 'white-pink';

  // Board container classes
  const boardBg = isBlackGold
    ? 'bg-[#171717] border-[#4A3A12] text-white'
    : isWhitePink
    ? 'bg-white border-[#F3D5DF] text-[#3E2731]'
    : 'bg-white border-[#D6E4F0] text-[#17324D]';

  const gridInnerBg = isBlackGold
    ? 'bg-[#0B0B0B] border-[#4A3A12]/60'
    : isWhitePink
    ? 'bg-[#FFF7FA] border-[#F3D5DF]/60'
    : 'bg-[#F5FAFF] border-[#D6E4F0]/60';

  const headerBorder = isBlackGold
    ? 'border-[#4A3A12]'
    : isWhitePink
    ? 'border-[#F3D5DF]'
    : 'border-[#D6E4F0]';

  const headerDot = isBlackGold
    ? 'bg-[#D4AF37]'
    : isWhitePink
    ? 'bg-[#D81B60]'
    : 'bg-[#1565C0]';

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-6 shadow-md transition-colors border ${boardBg} ${className}`}
    >
      {/* Board Header & Legend */}
      <div className={`flex flex-wrap items-center justify-between pb-3.5 mb-4 border-b ${headerBorder} gap-2`}>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${headerDot}`} />
          <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase">
            Tambola Board ({numberRange.start}–{numberRange.end})
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 opacity-75">
            <div className={`w-3.5 h-3.5 rounded border ${
              isBlackGold ? 'bg-[#171717] border-[#4A3A12]' : 'bg-white border-slate-300'
            }`} />
            <span className="hidden sm:inline">Uncalled</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold">
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${
              isBlackGold ? 'bg-[#D4AF37] text-[#0B0B0B]' : isWhitePink ? 'bg-[#EC407A] text-white' : 'bg-[#1976D2] text-white'
            }`}>
              ✓
            </div>
            <span className="hidden sm:inline">Called</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <div className={`w-3.5 h-3.5 rounded border-2 shadow-xs ${
              isBlackGold
                ? 'bg-[#FFD54F] border-[#FFC107]'
                : isWhitePink
                ? 'bg-[#AD1457] border-[#D81B60]'
                : 'bg-[#0D47A1] border-[#64B5F6]'
            }`} />
            <span>Current</span>
          </div>
        </div>
      </div>

      {/* Grid of Numbers: Strict ascending numerical order */}
      <div
        className={`grid grid-cols-10 gap-1.5 sm:gap-2 select-none p-2 sm:p-3 rounded-xl border ${gridInnerBg} ${
          isPresentationMode ? 'gap-2.5 sm:gap-3 p-4' : ''
        }`}
      >
        {orderedBoard.map((num) => {
          const isCalled = calledSet.has(num);
          const isCurrent = currentNumber === num;
          const isJustStamped = justCalledNumber === num;

          // Compute cell styles
          let cellStyle = '';

          if (isBlackGold) {
            if (isJustStamped) {
              cellStyle = 'animate-board-stamp bg-[#FFD54F] text-[#0B0B0B] ring-4 ring-[#FFC107] z-20 shadow-xl';
            } else if (isCurrent) {
              cellStyle = 'bg-[#FFD54F] text-[#0B0B0B] border-2 border-[#FFC107] shadow-lg shadow-amber-500/40 scale-105 z-10 animate-pulse-blue ring-2 ring-[#D4AF37]';
            } else if (isCalled) {
              cellStyle = 'bg-[#D4AF37] text-[#0B0B0B] border border-[#FFD54F] shadow-xs hover:brightness-110';
            } else {
              cellStyle = 'bg-[#171717] border border-[#4A3A12] text-[#D6D6D6] hover:bg-[#222222] hover:border-[#D4AF37]';
            }
          } else if (isWhitePink) {
            if (isJustStamped) {
              cellStyle = 'animate-board-stamp bg-[#AD1457] text-white ring-4 ring-[#EC407A] z-20 shadow-xl';
            } else if (isCurrent) {
              cellStyle = 'bg-[#AD1457] text-white border-2 border-[#D81B60] shadow-lg shadow-pink-900/30 scale-105 z-10 animate-pulse-blue ring-2 ring-[#EC407A]';
            } else if (isCalled) {
              cellStyle = 'bg-[#EC407A] text-white border border-[#D81B60] shadow-xs hover:brightness-105';
            } else {
              cellStyle = 'bg-white border border-[#F3D5DF] text-[#3E2731] hover:bg-[#FCE4EC] hover:border-[#EC407A]';
            }
          } else {
            // White & Blue
            if (isJustStamped) {
              cellStyle = 'animate-board-stamp bg-[#0D47A1] text-white ring-4 ring-[#64B5F6] z-20 shadow-xl';
            } else if (isCurrent) {
              cellStyle = 'bg-[#0D47A1] text-white border-2 border-[#64B5F6] shadow-lg shadow-blue-900/40 scale-105 z-10 animate-pulse-blue ring-2 ring-[#1976D2]';
            } else if (isCalled) {
              cellStyle = 'bg-[#1976D2] text-white border border-[#1565C0] shadow-xs hover:brightness-110';
            } else {
              cellStyle = 'bg-white border border-[#D6E4F0] text-[#17324D] hover:bg-[#E3F2FD] hover:border-[#1976D2]';
            }
          }

          return (
            <button
              key={num}
              type="button"
              onClick={() => onNumberClick && onNumberClick(num)}
              aria-label={`Number ${num}${isCurrent ? ', currently called' : isCalled ? ', already called' : ', uncalled'}`}
              className={`aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center relative font-mono-nums font-bold transition-all duration-150 ${
                isPresentationMode ? 'text-base sm:text-xl lg:text-2xl' : 'text-xs sm:text-sm md:text-base'
              } ${cellStyle}`}
            >
              <span>{num}</span>
              {isCalled && !isCurrent && (
                <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 absolute bottom-0.5 sm:bottom-1 stroke-[2.5] ${
                  isBlackGold ? 'text-[#0B0B0B]/80' : 'text-white/90'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
