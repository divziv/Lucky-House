import React from 'react';
import { GameConfig, PrizeCategory } from '../../types/tambola';
import { PRIZE_LABELS } from '../../services/gameEngine';
import { Trophy, CheckCircle, Smartphone, FileText, ShieldCheck, XCircle } from 'lucide-react';

export interface GameReviewProps {
  config: GameConfig;
}

export const GameReview: React.FC<GameReviewProps> = ({ config }) => {
  const totalNumbers = config.numberRange.end - config.numberRange.start + 1;

  const prizeOrder: PrizeCategory[] = [
    'fastFive',
    'firstLine',
    'secondLine',
    'thirdLine',
    'fullHouse',
    'lastFive',
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Game Summary</h2>
        <p className="text-sm opacity-75 mt-1">
          Review your game rules and prize configuration before starting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode & Range */}
        <div className="p-4 rounded-xl bg-white/5 border border-slate-700/40 space-y-3">
          <div className="text-xs uppercase tracking-wider opacity-75 font-semibold flex items-center gap-1.5">
            {config.mode === 'physical' ? (
              <FileText className="w-4 h-4 text-indigo-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-purple-400" />
            )}
            Game Mode &amp; Range
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm opacity-75">Mode</span>
            <span className="text-sm font-bold capitalize">
              {config.mode === 'physical' ? 'Physical Paper' : 'Virtual'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
            <span className="text-sm opacity-75">Number Range</span>
            <span className="text-sm font-bold font-mono-nums text-amber-500">
              {config.numberRange.start}–{config.numberRange.end} ({totalNumbers} numbers)
            </span>
          </div>
        </div>

        {/* Eligibility & Audio */}
        <div className="p-4 rounded-xl bg-white/5 border border-slate-700/40 space-y-3">
          <div className="text-xs uppercase tracking-wider opacity-75 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Rules &amp; Voice Style
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm opacity-75">Line Winners for Full House</span>
            <span className="text-sm font-bold">
              {config.lineWinnerFullHouseEligibility ? 'Allowed (Yes)' : 'Not Allowed (No)'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
            <span className="text-sm opacity-75">Calling Style</span>
            <span className="text-sm font-bold capitalize">
              {config.voiceSettings.callingStyle}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Breakdown Table */}
      <div className="p-5 rounded-2xl bg-white/5 border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Prizes
          </h3>
        </div>

        <div className="divide-y divide-slate-700/30">
          {prizeOrder.map((cat) => {
            const item = config.prizes[cat];
            const isEnabled = item && item.enabled && item.winners > 0;

            return (
              <div key={cat} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isEnabled ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={isEnabled ? 'font-medium' : 'opacity-60 line-through-none'}>
                    {PRIZE_LABELS[cat]}
                  </span>
                </div>

                <span
                  className={`font-bold font-mono-nums ${
                    isEnabled ? 'text-amber-500' : 'text-slate-500 font-normal'
                  }`}
                >
                  {isEnabled
                    ? `${item.winners} ${item.winners === 1 ? 'winner' : 'winners'}`
                    : 'Disabled'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
