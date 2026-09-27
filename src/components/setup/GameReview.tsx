import React from 'react';
import { GameConfig } from '../../types/tambola';
import { PRIZE_LABELS } from '../../services/gameEngine';
import { Trophy, CheckCircle, Smartphone, FileText, Volume2, ShieldCheck } from 'lucide-react';

export interface GameReviewProps {
  config: GameConfig;
}

export const GameReview: React.FC<GameReviewProps> = ({ config }) => {
  const totalNumbers = config.numberRange.end - config.numberRange.start + 1;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Ready to Launch!</h2>
        <p className="text-sm text-slate-400 mt-1">
          Review your game rules and prize setup before starting the session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode & Range */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            {config.mode === 'physical' ? (
              <FileText className="w-4 h-4 text-indigo-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-purple-400" />
            )}
            Game Mode & Range
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-slate-300">Format:</span>
            <span className="text-sm font-bold text-white capitalize">
              {config.mode === 'physical' ? 'Physical Paper Tickets' : 'Virtual Digital Cards'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-sm text-slate-300">Number Range:</span>
            <span className="text-sm font-bold text-amber-400 font-mono-nums">
              {config.numberRange.start} to {config.numberRange.end} ({totalNumbers} numbers)
            </span>
          </div>
        </div>

        {/* Eligibility & Audio */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Rules & Voice Style
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-slate-300">Line Winners for Full House:</span>
            <span className="text-sm font-bold text-slate-200">
              {config.lineWinnerFullHouseEligibility ? 'Allowed (Yes)' : 'Not Allowed (No)'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-sm text-slate-300">Calling Style:</span>
            <span className="text-sm font-bold text-slate-200 capitalize">
              {config.voiceSettings.callingStyle}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Breakdown Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Configured Prizes & Winner Limits
          </h3>
        </div>

        <div className="divide-y divide-slate-800/80">
          {(Object.entries(config.prizes) as [keyof typeof config.prizes, number][]).map(
            ([cat, count]) => {
              if (count === 0 && cat !== 'fastFive') return null;
              return (
                <div key={cat} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200">{PRIZE_LABELS[cat]}</span>
                  </div>
                  <span className="font-bold text-amber-400 font-mono-nums">
                    {count} {count === 1 ? 'Winner' : 'Winners'}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
