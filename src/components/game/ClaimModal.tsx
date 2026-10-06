import React, { useState } from 'react';
import { GameConfig, GameState, Player, PrizeCategory } from '../../types/tambola';
import { PRIZE_LABELS, isPrizeAvailable, isPlayerEligibleForCategory } from '../../services/gameEngine';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onConfirmWinner: (playerName: string, category: PrizeCategory, playerId?: string, ticketNumber?: number) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onConfirmWinner,
}) => {
  const config = gameState.config;
  const categories = (Object.keys(config.prizes) as PrizeCategory[]).filter(
    (c) => config.prizes[c]?.enabled && config.prizes[c]?.winners > 0
  );

  const [playerName, setPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrizeCategory>(() => categories[0] || 'firstLine');
  const [ticketNum, setTicketNum] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');

  const isAvailable = isPrizeAvailable(gameState, selectedCategory);

  const selectedPlayer = gameState.players.find((p) => p.id === selectedPlayerId);
  const eligibility = selectedPlayer
    ? isPlayerEligibleForCategory(selectedPlayer, selectedCategory, config)
    : { eligible: true };

  const handleSelectVirtualPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    const p = gameState.players.find((player) => player.id === playerId);
    if (p) {
      setPlayerName(p.name);
      setTicketNum(String(p.card.ticketNumber));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    if (!isAvailable) return;
    if (!eligibility.eligible) return;

    onConfirmWinner(
      playerName.trim(),
      selectedCategory,
      selectedPlayerId || undefined,
      ticketNum ? parseInt(ticketNum, 10) : undefined
    );

    setPlayerName('');
    setTicketNum('');
    setSelectedPlayerId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Winner Claim"
      subtitle="Verify player card and approve prize award"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Virtual Player Quick Select (if virtual players exist) */}
        {gameState.players.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#607D8B] dark:text-[#B0BEC5] mb-1.5">
              Select Joined Virtual Player (Optional)
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => handleSelectVirtualPlayer(e.target.value)}
              className="w-full bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A] rounded-xl px-3.5 py-2.5 text-sm text-[#17324D] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20"
            >
              <option value="">-- Manual Player Entry --</option>
              {gameState.players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Ticket #{p.card.ticketNumber})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Player Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#607D8B] dark:text-[#B0BEC5] mb-1.5">
            Player Name / Identifier *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Priya, Rahul, Ticket #4"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A] rounded-xl px-3.5 py-2.5 text-sm text-[#17324D] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20"
          />
        </div>

        {/* Prize Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#607D8B] dark:text-[#B0BEC5] mb-1.5">
            Prize Category *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as PrizeCategory)}
            className="w-full bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A] rounded-xl px-3.5 py-2.5 text-sm text-[#17324D] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20"
          >
            {categories.map((cat) => {
              const available = isPrizeAvailable(gameState, cat);
              return (
                <option key={cat} value={cat} disabled={!available}>
                  {PRIZE_LABELS[cat]} {!available ? '(Full / Closed)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Ticket / Card Number */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#607D8B] dark:text-[#B0BEC5] mb-1.5">
            Physical Ticket / Card # (Optional)
          </label>
          <input
            type="number"
            min="1"
            max="9999"
            placeholder="e.g. 4"
            value={ticketNum}
            onChange={(e) => setTicketNum(e.target.value)}
            className="w-full bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A] rounded-xl px-3.5 py-2.5 text-sm text-[#17324D] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20"
          />
        </div>

        {/* Eligibility warnings */}
        {!isAvailable && (
          <div className="p-3 rounded-xl bg-[#FFEBEE] dark:bg-[#B71C1C]/20 border border-[#FFCDD2] dark:border-[#D32F2F]/40 flex items-start gap-2 text-xs text-[#D32F2F] dark:text-[#EF5350]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>All configured spots for {PRIZE_LABELS[selectedCategory]} have already been claimed.</span>
          </div>
        )}

        {selectedPlayer && !eligibility.eligible && (
          <div className="p-3 rounded-xl bg-[#FFF8E1] dark:bg-[#F57F17]/20 border border-[#FFE082] dark:border-[#F9A825]/40 flex items-start gap-2 text-xs text-[#F9A825] dark:text-[#FFCA28]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{eligibility.reason}</span>
          </div>
        )}

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6E4F0] dark:border-[#26354A]">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={!playerName.trim() || !isAvailable || !eligibility.eligible}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Winner</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
