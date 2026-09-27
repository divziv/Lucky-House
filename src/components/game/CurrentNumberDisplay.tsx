import React from 'react';
import { getNumberAnnouncement } from '../../utils/numberCallPhrases';
import { CallingStyle, NumberRange } from '../../types/tambola';
import { Volume2, Hash, ArrowLeft, Crown } from 'lucide-react';

export interface CurrentNumberDisplayProps {
  currentNumber: number | null;
  previousNumber: number | null;
  calledCount: number;
  numberRange: NumberRange;
  callingStyle: CallingStyle;
  onRepeatVoice: () => void;
  isPresentationMode?: boolean;
}

export const CurrentNumberDisplay: React.FC<CurrentNumberDisplayProps> = ({
  currentNumber,
  previousNumber,
  calledCount,
  numberRange,
  callingStyle,
  onRepeatVoice,
  isPresentationMode = false,
}) => {
  const totalPool = numberRange.end - numberRange.start + 1;
  const progressPercent = Math.min(100, Math.round((calledCount / totalPool) * 100));
  const remaining = Math.max(0, totalPool - calledCount);

  const announcement = currentNumber
    ? getNumberAnnouncement(currentNumber, numberRange, callingStyle)
    : null;

  const isTopOfHouse = currentNumber !== null && currentNumber === numberRange.end;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] p-6 shadow-md flex flex-col justify-between min-h-[340px] transition-colors">
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-xs text-[#607D8B] dark:text-[#B0BEC5] pb-3 border-b border-[#D6E4F0] dark:border-[#26354A]">
        <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-[#1565C0] dark:text-[#64B5F6]">
          <Hash className="w-3.5 h-3.5" />
          <span>CURRENT NUMBER</span>
        </div>

        <div className="font-mono-nums flex items-center gap-2 text-xs">
          <span>
            Range: <strong className="text-[#17324D] dark:text-[#F8FAFC]">{numberRange.start}–{numberRange.end}</strong>
          </span>
        </div>
      </div>

      {/* Main Big Number Display: White Card with Blue Accent */}
      <div className="my-auto py-4 flex flex-col items-center justify-center text-center">
        {currentNumber !== null ? (
          <div key={currentNumber} className="animate-call-pop flex flex-col items-center w-full">
            {/* Top of the House Badge */}
            {isTopOfHouse && (
              <div className="mb-2 px-3.5 py-1 rounded-full bg-[#1565C0] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-800/20 animate-pulse">
                <Crown className="w-3.5 h-3.5 fill-current" />
                TOP OF THE HOUSE
              </div>
            )}

            {/* Giant Number styled per prompt: font-size clamp(4rem, 10vw, 8rem), color #1565C0 */}
            <div className="relative flex items-center justify-center my-1">
              <span
                style={{ fontSize: isPresentationMode ? 'clamp(6rem, 14vw, 11rem)' : 'clamp(4rem, 10vw, 8rem)' }}
                className="font-extrabold font-mono-nums leading-none tracking-tight text-[#1565C0] dark:text-[#64B5F6] drop-shadow-sm select-none"
              >
                {currentNumber}
              </span>

              {/* Repeat voice button */}
              <button
                type="button"
                onClick={onRepeatVoice}
                title="Repeat voice announcement"
                aria-label="Repeat voice announcement"
                className="absolute -right-10 sm:-right-12 bottom-2 p-2 rounded-full bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-md border border-[#1976D2] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Number Description */}
            {announcement && (
              <div className="mt-2 space-y-0.5 max-w-sm">
                <div className="text-base sm:text-lg font-bold text-[#1565C0] dark:text-[#42A5F5] tracking-wide">
                  {announcement.primaryDescription}
                </div>
                {announcement.spokenPhrases[1] && (
                  <div className="text-xs sm:text-sm text-[#607D8B] dark:text-[#B0BEC5] font-mono-nums font-medium">
                    {announcement.spokenPhrases[1]}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-[#607D8B] dark:text-[#B0BEC5]">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#D6E4F0] dark:border-[#26354A] flex items-center justify-center mb-3 bg-[#F5FAFF] dark:bg-[#0B1220]">
              <span className="text-4xl font-mono-nums font-bold text-[#607D8B]">--</span>
            </div>
            <p className="text-sm font-medium">
              Ready to draw! Click &ldquo;Next Number&rdquo; to begin.
            </p>
          </div>
        )}
      </div>

      {/* Progress & Telemetry Section */}
      <div className="w-full pt-3 border-t border-[#D6E4F0] dark:border-[#26354A] space-y-2">
        {/* Blue Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#17324D] dark:text-[#F8FAFC]">
            <span>Numbers Called</span>
            <span className="font-mono-nums">
              <strong className="text-[#1565C0] dark:text-[#64B5F6]">{calledCount}</strong> / {totalPool} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#E3F2FD] dark:bg-[#172033] overflow-hidden">
            <div
              className="h-full bg-[#1565C0] dark:bg-[#42A5F5] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#607D8B] dark:text-[#B0BEC5] pt-0.5">
            <div className="flex items-center gap-1 font-mono-nums">
              <ArrowLeft className="w-3 h-3" />
              <span>Previous:</span>
              {previousNumber !== null ? (
                <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] bg-[#E3F2FD] dark:bg-[#172033] px-1.5 py-0.2 rounded">
                  {previousNumber}
                </span>
              ) : (
                <span>None</span>
              )}
            </div>

            <span className="font-mono-nums font-semibold">
              {remaining} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
