import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface EligibilitySettingsProps {
  lineWinnerFullHouseEligibility: boolean;
  onChange: (eligible: boolean) => void;
}

export const EligibilitySettings: React.FC<EligibilitySettingsProps> = ({
  lineWinnerFullHouseEligibility,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Winner Eligibility Rules</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure progression rules for players who claim early line prizes.
        </p>
      </div>

      {/* Primary Decision Card: Line Winners for Full House */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Can Line Winners Continue for Full House?
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Decide if a player who wins First Line, Second Line, or Third Line remains eligible to claim Full House later in the same game.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Option: YES */}
          <div
            onClick={() => onChange(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(true)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
              lineWinnerFullHouseEligibility
                ? 'bg-indigo-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                Yes (Standard Rule)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Line winners keep their ticket active and can compete to win Full House.
              </p>
            </div>
            <div className="shrink-0 ml-2">
              {lineWinnerFullHouseEligibility ? (
                <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700" />
              )}
            </div>
          </div>

          {/* Option: NO */}
          <div
            onClick={() => onChange(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(false)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
              !lineWinnerFullHouseEligibility
                ? 'bg-indigo-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                No (Strict Spreading)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Once a player wins any line prize, their ticket is locked out from claiming Full House.
              </p>
            </div>
            <div className="shrink-0 ml-2">
              {!lineWinnerFullHouseEligibility ? (
                <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Enforced Rule Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-semibold text-amber-300 block mb-0.5">
            Strict Multi-Line Rule Enforced:
          </span>
          A player who has already won one specific line (e.g. First Line) cannot subsequently claim another line prize (e.g. Second Line or Third Line) using the same card. This guarantees fairness across all participants.
        </div>
      </div>
    </div>
  );
};
