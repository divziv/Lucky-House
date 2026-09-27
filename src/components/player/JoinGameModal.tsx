import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { sanitizeName } from '../../utils/gameCodeUtils';
import { Smartphone, User, KeyRound } from 'lucide-react';

export interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string, playerName: string) => void;
  initialCode?: string;
}

export const JoinGameModal: React.FC<JoinGameModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a valid Game Code.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your player name.');
      return;
    }
    setError('');
    onJoin(code.toUpperCase().trim(), sanitizeName(name));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Virtual Tambola Game"
      subtitle="Enter the room code and your player name to get your digital ticket"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Game Code (e.g. TMB-4827) *
          </label>
          <input
            type="text"
            required
            placeholder="TMB-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono-nums font-bold tracking-wider focus:outline-none focus:border-amber-400 uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Your Player Name *
          </label>
          <input
            type="text"
            required
            maxLength={20}
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit">
            <Smartphone className="w-4 h-4" />
            Get My Ticket & Join
          </Button>
        </div>
      </form>
    </Modal>
  );
};
