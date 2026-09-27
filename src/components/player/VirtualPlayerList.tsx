import React from 'react';
import { Player } from '../../types/tambola';
import { Users, Plus, Eye, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export interface VirtualPlayerListProps {
  players: Player[];
  calledNumbers: number[];
  onAddSimulatedPlayer: () => void;
  onViewPlayerCard: (player: Player) => void;
}

export const VirtualPlayerList: React.FC<VirtualPlayerListProps> = ({
  players,
  calledNumbers,
  onAddSimulatedPlayer,
  onViewPlayerCard,
}) => {
  const calledSet = React.useMemo(() => new Set(calledNumbers), [calledNumbers]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            Virtual Players ({players.length})
          </h2>
        </div>

        <Button variant="secondary" size="sm" onClick={onAddSimulatedPlayer}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Ticket</span>
        </Button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400">
          No virtual players yet. Click &ldquo;Add Ticket&rdquo; to add a local virtual player or share the Game Code with friends!
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {players.map((player) => {
            const matches = player.card.allNumbers.filter((n) => calledSet.has(n)).length;

            return (
              <div
                key={player.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    {player.name}
                    {player.wonCategories.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold">
                        Winner
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono-nums mt-0.5">
                    Ticket #{player.card.ticketNumber} · {matches} / 15 marked
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPlayerCard(player)}
                    className="py-1 px-2.5 min-h-[30px] text-xs text-slate-300 hover:text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Card</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
