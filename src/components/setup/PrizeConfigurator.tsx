import React from 'react';
import { PrizeConfig } from '../../types/tambola';
import { CounterInput } from '../common/CounterInput';
import { Trophy, Award, Gift } from 'lucide-react';

export interface PrizeConfiguratorProps {
  prizes: PrizeConfig;
  onChange: (prizes: PrizeConfig) => void;
}

export const PrizeConfigurator: React.FC<PrizeConfiguratorProps> = ({ prizes, onChange }) => {
  const updatePrize = (key: keyof PrizeConfig, val: number) => {
    onChange({
      ...prizes,
      [key]: val,
    });
  };

  const totalPrizeSpots =
    prizes.fastFive +
    prizes.firstLine +
    prizes.secondLine +
    prizes.thirdLine +
    prizes.fullHouse +
    prizes.lastFive;

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Configure Prizes</h2>
        <p className="text-sm text-slate-400 mt-1">
          Specify how many winners are allowed for each winning category.
        </p>
      </div>

      <div className="space-y-3">
        {/* Fast Five */}
        <div className="relative">
          <CounterInput
            label="Fast Five (Early 5)"
            description="First player to mark any 5 called numbers. Strict maximum of 1 winner."
            value={prizes.fastFive}
            min={0}
            max={1}
            onChange={(val) => updatePrize('fastFive', val)}
          />
        </div>

        {/* First Line */}
        <CounterInput
          label="First Line (Top Row)"
          description="Players who complete all 5 numbers on the 1st row of their ticket."
          value={prizes.firstLine}
          min={0}
          max={5}
          onChange={(val) => updatePrize('firstLine', val)}
        />

        {/* Second Line */}
        <CounterInput
          label="Second Line (Middle Row)"
          description="Players who complete all 5 numbers on the 2nd row of their ticket."
          value={prizes.secondLine}
          min={0}
          max={5}
          onChange={(val) => updatePrize('secondLine', val)}
        />

        {/* Third Line */}
        <CounterInput
          label="Third Line (Bottom Row)"
          description="Players who complete all 5 numbers on the 3rd row of their ticket."
          value={prizes.thirdLine}
          min={0}
          max={5}
          onChange={(val) => updatePrize('thirdLine', val)}
        />

        {/* Full House */}
        <CounterInput
          label="Full House (All 15 Numbers)"
          description="The grand prize for completing every number on the ticket."
          value={prizes.fullHouse}
          min={1}
          max={5}
          onChange={(val) => updatePrize('fullHouse', val)}
        />

        {/* Optional Last Five */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                Last Five (Optional Bonus Prize)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Bonus category for tickets matching the final numbers called.
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prizes.lastFive > 0}
                onChange={(e) => updatePrize('lastFive', e.target.checked ? 1 : 0)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {prizes.lastFive > 0 && (
            <CounterInput
              label="Last Five Winners Count"
              value={prizes.lastFive}
              min={1}
              max={3}
              onChange={(val) => updatePrize('lastFive', val)}
            />
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total Prizes Configured
            </div>
            <div className="text-sm text-slate-200 mt-0.5">
              {totalPrizeSpots} {totalPrizeSpots === 1 ? 'Prize spot' : 'Prize spots'} available
            </div>
          </div>
        </div>

        <div className="text-2xl font-black text-amber-400 font-mono-nums">
          {totalPrizeSpots}
        </div>
      </div>
    </div>
  );
};
