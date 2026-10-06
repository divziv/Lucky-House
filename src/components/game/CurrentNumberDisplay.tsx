import React from 'react';
import { getNumberAnnouncement } from '../../utils/numberCallPhrases';
import { CallingStyle, NumberRange } from '../../types/tambola';
import { useTheme } from '../../context/ThemeContext';
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
  const { theme } = useTheme();
  const totalPool = numberRange.end - numberRange.start + 1;
  const progressPercent = Math.min(100, Math.round((calledCount / totalPool) * 100));
  const remaining = Math.max(0, totalPool - calledCount);

  const announcement = currentNumber
    ? getNumberAnnouncement(currentNumber, numberRange, callingStyle)
    : null;

  const isTopOfHouse = currentNumber !== null && currentNumber === numberRange.end;

  // Theme-specific styling classes
  const isBlackGold = theme === 'black-gold';
  const isWhitePink = theme === 'white-pink';

  const cardContainerClass = isBlackGold
    ? 'bg-[#171717] border-[#4A3A12] text-white shadow-xl shadow-black/40'
    : isWhitePink
    ? 'bg-white border-[#F3D5DF] text-[#3E2731] shadow-md'
    : 'bg-white border-[#D6E4F0] text-[#17324D] shadow-md';

  const headerBorderClass = isBlackGold
    ? 'border-[#4A3A12] text-[#D6D6D6]'
    : isWhitePink
    ? 'border-[#F3D5DF] text-[#795E68]'
    : 'border-[#D6E4F0] text-[#607D8B]';

  const headerTitleColor = isBlackGold
    ? 'text-[#FFD54F]'
    : isWhitePink
    ? 'text-[#D81B60]'
    : 'text-[#1565C0]';

  const bigNumberColor = isBlackGold
    ? 'text-[#FFD54F] drop-shadow-[0_0_25px_rgba(255,213,79,0.35)]'
    : isWhitePink
    ? 'text-[#D81B60] drop-shadow-sm'
    : 'text-[#1565C0] drop-shadow-sm';

  const voiceButtonClass = isBlackGold
    ? 'bg-[#FFD54F] hover:bg-[#FFC107] text-[#0B0B0B] border-[#D4AF37]'
    : isWhitePink
    ? 'bg-[#D81B60] hover:bg-[#AD1457] text-white border-[#EC407A]'
    : 'bg-[#1565C0] hover:bg-[#0D47A1] text-white border-[#1976D2]';

  const progressBarClass = isBlackGold
    ? 'bg-[#FFD54F]'
    : isWhitePink
    ? 'bg-[#EC407A]'
    : 'bg-[#1565C0]';

  const progressBgClass = isBlackGold
    ? 'bg-[#261E0A]'
    : isWhitePink
    ? 'bg-[#FCE4EC]'
    : 'bg-[#E3F2FD]';

  const crownBadgeClass = isBlackGold
    ? 'bg-[#D4AF37] text-[#0B0B0B] border border-[#FFD54F] shadow-lg shadow-amber-500/20'
    : isWhitePink
    ? 'bg-[#D81B60] text-white shadow-md'
    : 'bg-[#1565C0] text-white shadow-md shadow-blue-800/20';

  const descriptionColor = isBlackGold
    ? 'text-[#FFD54F]'
    : isWhitePink
    ? 'text-[#D81B60]'
    : 'text-[#1565C0]';

  const subtextColor = isBlackGold
    ? 'text-[#D6D6D6]'
    : isWhitePink
    ? 'text-[#795E68]'
    : 'text-[#607D8B]';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between min-h-[340px] transition-colors ${cardContainerClass}`}>
      {/* Top Telemetry Header */}
      <div className={`w-full flex items-center justify-between text-xs pb-3 border-b ${headerBorderClass}`}>
        <div className={`flex items-center gap-1.5 font-bold tracking-wider uppercase ${headerTitleColor}`}>
          <Hash className="w-3.5 h-3.5" />
          <span>CURRENT NUMBER</span>
        </div>

        <div className="font-mono-nums flex items-center gap-2 text-xs">
          <span>
            Range: <strong>{numberRange.start}–{numberRange.end}</strong>
          </span>
        </div>
      </div>

      {/* Main Big Number Display */}
      <div className="my-auto py-4 flex flex-col items-center justify-center text-center">
        {currentNumber !== null ? (
          <div key={currentNumber} className="animate-call-pop flex flex-col items-center w-full">
            {/* Top of the House Badge */}
            {isTopOfHouse && (
              <div className={`mb-2 px-3.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 animate-pulse ${crownBadgeClass}`}>
                <Crown className="w-3.5 h-3.5 fill-current" />
                TOP OF THE HOUSE
              </div>
            )}

            {/* Giant Number styled per prompt: font-size clamp(4rem, 10vw, 8rem), prominent gold in Black & Gold */}
            <div className="relative flex items-center justify-center my-1">
              <span
                style={{ fontSize: isPresentationMode ? 'clamp(6rem, 14vw, 11rem)' : 'clamp(4rem, 10vw, 8rem)' }}
                className={`font-black font-mono-nums leading-none tracking-tight select-none transition-colors ${bigNumberColor}`}
              >
                {currentNumber}
              </span>

              {/* Repeat voice button */}
              <button
                type="button"
                onClick={onRepeatVoice}
                title="Repeat voice announcement"
                aria-label="Repeat voice announcement"
                className={`absolute -right-10 sm:-right-12 bottom-2 p-2 rounded-full shadow-md border transition-transform hover:scale-110 active:scale-95 cursor-pointer ${voiceButtonClass}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Number Description */}
            {announcement && (
              <div className="mt-2 space-y-0.5 max-w-sm">
                <div className={`text-base sm:text-lg font-bold tracking-wide transition-colors ${descriptionColor}`}>
                  {announcement.primaryDescription}
                </div>
                {announcement.spokenPhrases[1] && (
                  <div className={`text-xs sm:text-sm font-mono-nums font-medium ${subtextColor}`}>
                    {announcement.spokenPhrases[1]}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={`py-8 flex flex-col items-center ${subtextColor}`}>
            <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center mb-3 ${headerBorderClass}`}>
              <span className="text-4xl font-mono-nums font-bold opacity-60">--</span>
            </div>
            <p className="text-sm font-medium">
              Ready to draw! Click &ldquo;Next Number&rdquo; to begin.
            </p>
          </div>
        )}
      </div>

      {/* Progress & Telemetry Section */}
      <div className={`w-full pt-3 border-t space-y-2 ${headerBorderClass}`}>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Numbers Called</span>
            <span className="font-mono-nums">
              <strong className={headerTitleColor}>{calledCount}</strong> / {totalPool} ({progressPercent}%)
            </span>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${progressBgClass}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressBarClass}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className={`flex items-center justify-between text-[11px] pt-0.5 ${subtextColor}`}>
            <div className="flex items-center gap-1 font-mono-nums">
              <ArrowLeft className="w-3 h-3" />
              <span>Previous:</span>
              {previousNumber !== null ? (
                <span className={`font-bold px-1.5 py-0.2 rounded ${progressBgClass} ${headerTitleColor}`}>
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
