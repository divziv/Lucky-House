import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { soundFX } from '../../utils/soundUtils';

export interface CounterInputProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (newValue: number) => void;
}

export const CounterInput: React.FC<CounterInputProps> = ({
  label,
  description,
  value,
  min = 0,
  max = 10,
  disabled = false,
  onChange,
}) => {
  const handleDecrement = () => {
    if (disabled || value <= min) return;
    soundFX.playClick(0.2);
    onChange(value - 1);
  };

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    soundFX.playClick(0.2);
    onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-colors">
      <div className="flex-1 pr-4">
        <div className="text-sm font-semibold text-slate-100">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
      </div>

      <div className="flex items-center gap-2 select-none" role="group" aria-label={`${label} winner count`}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span
          className="w-10 text-center font-bold text-base text-amber-400 font-mono-nums"
          aria-live="polite"
        >
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
