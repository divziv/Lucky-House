import React, { useEffect, useState } from 'react';
import { getNumberAnnouncement } from '../../utils/numberCallPhrases';
import { CallingStyle, NumberRange } from '../../types/tambola';
import { Crown, Sparkles, CheckCircle2, X } from 'lucide-react';

export interface NumberPopModalProps {
  number: number | null;
  numberRange: NumberRange;
  callingStyle: CallingStyle;
  isMarkedOnBoard?: boolean;
  onAnimationEnd: () => void;
}

export const NumberPopModal: React.FC<NumberPopModalProps> = ({
  number,
  numberRange,
  callingStyle,
  isMarkedOnBoard = false,
  onAnimationEnd,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (number !== null) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onAnimationEnd, 150);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [number, onAnimationEnd]);

  if (number === null || !visible) return null;

  const announcement = getNumberAnnouncement(number, numberRange, callingStyle);
  const isTopOfHouse = number === numberRange.end;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17324D]/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-200 cursor-pointer"
      onClick={onAnimationEnd}
      role="dialog"
      aria-label={`Drawn number ${number}`}
      aria-live="assertive"
    >
      {/* Pop Container */}
      <div
        className="relative z-10 flex flex-col items-center animate-overlay-pop select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Blue Glow aura */}
        <div className="absolute -inset-16 bg-[#1976D2]/25 dark:bg-[#42A5F5]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top of House or Milestone Banner */}
        {isTopOfHouse ? (
          <div className="mb-3 px-5 py-2 rounded-full bg-[#1565C0] text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl shadow-blue-900/30 border-2 border-[#64B5F6] animate-bounce">
            <Crown className="w-4 h-4 fill-white" />
            <span>TOP OF THE HOUSE</span>
            <Crown className="w-4 h-4 fill-white" />
          </div>
        ) : (
          <div className="mb-3 px-4 py-1.5 rounded-full bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] text-[#1565C0] dark:text-[#64B5F6] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Next Draw</span>
          </div>
        )}

        {/* 3D Blue Tambola Ball */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full p-2.5 bg-gradient-to-tr from-[#0D47A1] via-[#1565C0] to-[#1976D2] shadow-[0_20px_50px_rgba(21,101,192,0.45)] flex items-center justify-center border-4 border-[#64B5F6]/80">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1565C0] via-[#0D47A1] to-[#0A3880] flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-white/20">
            {/* Top Gloss Arc */}
            <div className="absolute top-1 left-4 right-4 h-16 bg-gradient-to-b from-white/35 to-transparent rounded-t-full pointer-events-none" />

            {/* Giant Number */}
            <span className="text-7xl sm:text-9xl font-black text-white font-mono-nums tracking-tighter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] z-10">
              {number}
            </span>
          </div>
        </div>

        {/* Call Announcement Card — Clean White Surface */}
        <div className="mt-5 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#1976D2] dark:border-[#42A5F5] text-center shadow-2xl max-w-sm sm:max-w-md w-full">
          <div className="text-base sm:text-xl font-black text-[#1565C0] dark:text-[#64B5F6] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1976D2] shrink-0" />
            <span>{announcement.primaryDescription}</span>
          </div>

          {announcement.spokenPhrases[1] && (
            <div className="text-xs sm:text-sm text-[#607D8B] dark:text-[#B0BEC5] font-mono-nums mt-1 font-semibold">
              {announcement.spokenPhrases[1]}
            </div>
          )}

          {/* Board Stamping Status Indicator */}
          <div className="mt-3 pt-2.5 border-t border-[#D6E4F0] dark:border-[#26354A] flex items-center justify-center gap-1.5 text-xs font-semibold">
            {isMarkedOnBoard ? (
              <span className="text-[#2E7D32] dark:text-[#66BB6A] flex items-center gap-1 animate-call-pop">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Marked on Tambola Board
              </span>
            ) : (
              <span className="text-[#1976D2] dark:text-[#42A5F5] flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#1976D2] animate-ping" />
                Marking on board...
              </span>
            )}
          </div>
        </div>

        {/* Quick dismiss hint */}
        <button
          type="button"
          onClick={onAnimationEnd}
          className="mt-3 text-[11px] text-[#607D8B] dark:text-[#B0BEC5] hover:text-[#1565C0] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
          Click anywhere to continue
        </button>
      </div>
    </div>
  );
};
