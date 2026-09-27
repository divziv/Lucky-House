import React, { useState } from 'react';
import { NumberRange } from '../../types/tambola';
import { validateNumberRange, MAX_NUMBER } from '../../utils/numberRangeUtils';
import { CheckCircle2, Sparkles, Sliders } from 'lucide-react';

export interface NumberRangeSelectorProps {
  selectedRange: NumberRange;
  onSelectRange: (range: NumberRange) => void;
}

interface PresetOption {
  start: number;
  end: number;
  label: string;
  subtitle: string;
  popular?: boolean;
}

const PRESETS: PresetOption[] = [
  {
    start: 1,
    end: 70,
    label: '1 to 70',
    subtitle: 'Fast-paced, quick games for short rounds',
  },
  {
    start: 1,
    end: 80,
    label: '1 to 80',
    subtitle: 'Medium length game with balanced pace',
  },
  {
    start: 1,
    end: 90,
    label: '1 to 90',
    subtitle: 'Classic British & Indian traditional Tambola standard',
    popular: true,
  },
  {
    start: 1,
    end: 100,
    label: '1 to 100',
    subtitle: 'Century round for extended party sessions',
  },
];

export const NumberRangeSelector: React.FC<NumberRangeSelectorProps> = ({
  selectedRange,
  onSelectRange,
}) => {
  const isPresetMatch = (start: number, end: number) => {
    return PRESETS.some((p) => p.start === start && p.end === end);
  };

  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !isPresetMatch(selectedRange.start, selectedRange.end)
  );

  const [startInput, setStartInput] = useState<number>(selectedRange.start);
  const [endInput, setEndInput] = useState<number>(selectedRange.end);
  const validation = validateNumberRange(startInput, endInput);

  const handleSelectPreset = (preset: PresetOption) => {
    setIsCustomMode(false);
    setStartInput(preset.start);
    setEndInput(preset.end);
    onSelectRange({ start: preset.start, end: preset.end });
  };

  const handleSwitchToCustom = () => {
    setIsCustomMode(true);
  };

  const handleStartChange = (val: number) => {
    setStartInput(val);
    const valid = validateNumberRange(val, endInput);
    if (valid.valid) {
      onSelectRange({ start: val, end: endInput });
    }
  };

  const handleEndChange = (val: number) => {
    setEndInput(val);
    const valid = validateNumberRange(startInput, val);
    if (valid.valid) {
      onSelectRange({ start: startInput, end: val });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Configure Number Range</h2>
        <p className="text-sm text-slate-400 mt-1">
          Select a popular preset or define a custom starting and ending number.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PRESETS.map((opt) => {
          const isSelected =
            !isCustomMode &&
            selectedRange.start === opt.start &&
            selectedRange.end === opt.end;

          return (
            <div
              key={`${opt.start}-${opt.end}`}
              onClick={() => handleSelectPreset(opt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectPreset(opt)}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-amber-400 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {opt.popular && (
                <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  CLASSIC DEFAULT
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-black text-amber-400 font-mono-nums mb-0.5">
                    {opt.label}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{opt.subtitle}</p>
                </div>
                <div className="shrink-0 ml-3">
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono-nums flex items-center justify-between">
                <span>Start: {opt.start} &middot; End: {opt.end}</span>
                <span className="text-slate-300 font-semibold">{opt.end - opt.start + 1} numbers</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Range Card & Inputs */}
      <div
        className={`p-5 rounded-2xl border-2 transition-all ${
          isCustomMode
            ? 'bg-indigo-950/40 border-amber-400 shadow-xl shadow-amber-500/10'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div
          onClick={handleSwitchToCustom}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSwitchToCustom()}
          className="flex items-center justify-between cursor-pointer mb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Custom Range</div>
              <div className="text-xs text-slate-400">
                Define custom starting and ending numbers (e.g. 10–75, 20–80)
              </div>
            </div>
          </div>

          <div className="shrink-0 ml-3">
            {isCustomMode ? (
              <CheckCircle2 className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Starting Number (Inclusive)
            </label>
            <input
              type="number"
              min="1"
              max={endInput - 1}
              value={startInput}
              onFocus={handleSwitchToCustom}
              onChange={(e) => handleStartChange(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base text-amber-400 font-mono-nums font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Last Number (Inclusive / Top of House)
            </label>
            <input
              type="number"
              min={startInput + 1}
              max={MAX_NUMBER}
              value={endInput}
              onFocus={handleSwitchToCustom}
              onChange={(e) => handleEndChange(parseInt(e.target.value, 10) || startInput + 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base text-amber-400 font-mono-nums font-bold focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Validation Feedback */}
        {!validation.valid ? (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {validation.error}
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-400 font-mono-nums flex items-center justify-between">
            <span>
              Configured range: <strong className="text-amber-400">{selectedRange.start}–{selectedRange.end}</strong>
            </span>
            <span>
              Total numbers: <strong className="text-white">{validation.count}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
