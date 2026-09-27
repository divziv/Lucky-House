import React from 'react';
import { GameMode } from '../../types/tambola';
import { FileText, Smartphone, CheckCircle2 } from 'lucide-react';

export interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Choose Game Mode</h2>
        <p className="text-sm text-slate-400 mt-1">
          Select how your players will participate in this Tambola session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Physical Paper Mode */}
        <div
          onClick={() => onSelectMode('physical')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectMode('physical')}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
            selectedMode === 'physical'
              ? 'bg-indigo-950/40 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          {selectedMode === 'physical' && (
            <div className="absolute top-4 right-4 text-amber-400">
              <CheckCircle2 className="w-6 h-6 fill-amber-400/20" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Physical Paper Mode</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ideal for family gatherings, club events, and parties where players have printed or physical tickets.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Automatic random number generator with speech
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Large high-contrast display board for projection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Host manual winner verification & claims log
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
            No player devices required · Host controls everything
          </div>
        </div>

        {/* Virtual Game Mode */}
        <div
          onClick={() => onSelectMode('virtual')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectMode('virtual')}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
            selectedMode === 'virtual'
              ? 'bg-indigo-950/40 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          {selectedMode === 'virtual' && (
            <div className="absolute top-4 right-4 text-amber-400">
              <CheckCircle2 className="w-6 h-6 fill-amber-400/20" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Virtual Game Mode</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Players join digitally using a Game Code. Each player receives a unique, beautifully styled digital ticket.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Unique 15-number cards with vivid color themes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Live interactive marking & automatic matching
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Digital winner claims sent straight to host screen
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-purple-400">
            No player count limit · Multi-device or multi-tab play
          </div>
        </div>
      </div>
    </div>
  );
};
