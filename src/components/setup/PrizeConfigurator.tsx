import React from 'react';
import { PrizeConfig } from '../../types/tambola';
import { CounterInput } from '../common/CounterInput';
import { Trophy, Gift, Zap } from 'lucide-react';

export interface PrizeConfiguratorProps {
  prizes: PrizeConfig;
  onChange: (prizes: PrizeConfig) => void;
}

export const PrizeConfigurator: React.FC<PrizeConfiguratorProps> = ({ prizes, onChange }) => {
  const updateFastFiveEnabled = (enabled: boolean) => {
    onChange({
      ...prizes,
      fastFive: {
        enabled,
        winners: enabled ? Math.max(1, prizes.fastFive.winners || 1) : 0,
      },
    });
  };

  const updateFastFiveWinners = (winners: number) => {
    onChange({
      ...prizes,
      fastFive: {
        enabled: winners > 0,
        winners,
      },
    });
  };

  const updateLinePrize = (key: 'firstLine' | 'secondLine' | 'thirdLine' | 'fullHouse', winners: number) => {
    onChange({
      ...prizes,
      [key]: {
        enabled: winners > 0,
        winners,
      },
    });
  };

  const updateLastFiveEnabled = (enabled: boolean) => {
    onChange({
      ...prizes,
      lastFive: {
        enabled,
        winners: enabled ? Math.max(1, prizes.lastFive.winners || 1) : 0,
      },
    });
  };

  const updateLastFiveWinners = (winners: number) => {
    onChange({
      ...prizes,
      lastFive: {
        enabled: winners > 0,
        winners,
      },
    });
  };

  const totalPrizeSpots =
    (prizes.fastFive.enabled ? prizes.fastFive.winners : 0) +
    (prizes.firstLine.enabled ? prizes.firstLine.winners : 0) +
    (prizes.secondLine.enabled ? prizes.secondLine.winners : 0) +
    (prizes.thirdLine.enabled ? prizes.thirdLine.winners : 0) +
    (prizes.fullHouse.enabled ? prizes.fullHouse.winners : 0) +
    (prizes.lastFive.enabled ? prizes.lastFive.winners : 0);

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Configure Prizes</h2>
        <p className="text-sm opacity-75 mt-1">
          Specify which prize categories are active and how many winners are allowed.
        </p>
      </div>

      <div className="space-y-4">
        {/* Fast Five (Early 5) - Optional Toggle as required */}
        <div className="p-4 rounded-2xl bg-white/5 border border-slate-700/40 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                prizes.fastFive.enabled ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  Fast Five (Early 5)
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prizes.fastFive.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {prizes.fastFive.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  First player(s) to mark any 5 called numbers. Optional early game prize.
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={prizes.fastFive.enabled}
                onChange={(e) => updateFastFiveEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Winner Count Configurator - ONLY shown when Fast Five is ON */}
          {prizes.fastFive.enabled ? (
            <div className="pt-2 border-t border-slate-700/30">
              <CounterInput
                label="Fast Five Winner Count"
                description="Choose the number of Fast Five winners allowed."
                value={prizes.fastFive.winners}
                min={1}
                max={3}
                onChange={(val) => updateFastFiveWinners(val)}
              />
            </div>
          ) : (
            <div className="pt-1 text-xs text-slate-500 italic">
              Fast Five is OFF. The game will proceed directly toward line prizes without pausing.
            </div>
          )}
        </div>

        {/* First Line */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-700/30">
          <CounterInput
            label="First Line (Top Row)"
            description="Players who complete all 5 numbers on the 1st row of their ticket."
            value={prizes.firstLine.winners}
            min={0}
            max={5}
            onChange={(val) => updateLinePrize('firstLine', val)}
          />
        </div>

        {/* Second Line */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-700/30">
          <CounterInput
            label="Second Line (Middle Row)"
            description="Players who complete all 5 numbers on the 2nd row of their ticket."
            value={prizes.secondLine.winners}
            min={0}
            max={5}
            onChange={(val) => updateLinePrize('secondLine', val)}
          />
        </div>

        {/* Third Line */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-700/30">
          <CounterInput
            label="Third Line (Bottom Row)"
            description="Players who complete all 5 numbers on the 3rd row of their ticket."
            value={prizes.thirdLine.winners}
            min={0}
            max={5}
            onChange={(val) => updateLinePrize('thirdLine', val)}
          />
        </div>

        {/* Full House */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-700/30">
          <CounterInput
            label="Full House (All 15 Numbers)"
            description="The grand prize for completing every number on the ticket."
            value={prizes.fullHouse.winners}
            min={1}
            max={5}
            onChange={(val) => updateLinePrize('fullHouse', val)}
          />
        </div>

        {/* Optional Last Five */}
        <div className="p-4 rounded-2xl bg-white/5 border border-slate-700/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                prizes.lastFive.enabled ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  Last Five (Optional Bonus Prize)
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prizes.lastFive.enabled
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {prizes.lastFive.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  Bonus category for tickets matching the final numbers called in the session.
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={prizes.lastFive.enabled}
                onChange={(e) => updateLastFiveEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {prizes.lastFive.enabled && (
            <div className="pt-2 border-t border-slate-700/30">
              <CounterInput
                label="Last Five Winners Count"
                value={prizes.lastFive.winners}
                min={1}
                max={3}
                onChange={(val) => updateLastFiveWinners(val)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-75 font-semibold">
              Total Prizes Configured
            </div>
            <div className="text-sm font-medium mt-0.5">
              {totalPrizeSpots} {totalPrizeSpots === 1 ? 'Prize spot' : 'Prize spots'} available
            </div>
          </div>
        </div>

        <div className="text-2xl font-black font-mono-nums text-amber-500">
          {totalPrizeSpots}
        </div>
      </div>
    </div>
  );
};
