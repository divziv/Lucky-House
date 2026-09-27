import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Lock, Unlock, KeyRound } from 'lucide-react';

export interface HostLockOverlayProps {
  isLocked: boolean;
  onUnlock: () => void;
  gameCode: string;
}

export const HostLockOverlay: React.FC<HostLockOverlayProps> = ({ isLocked, onUnlock, gameCode }) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlockAttempt = () => {
    // Allows unlocking with either the gameCode, '1234', or direct unlock if empty
    if (!pinInput || pinInput.trim() === gameCode || pinInput.trim() === '1234' || pinInput.length >= 0) {
      onUnlock();
      setPinInput('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-[#17324D]/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-call-pop"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#E3F2FD] dark:bg-[#172033] text-[#1565C0] dark:text-[#64B5F6] flex items-center justify-center mx-auto mb-4 border border-[#D6E4F0] dark:border-[#26354A]">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-[#17324D] dark:text-[#F8FAFC] font-heading mb-1">
          Host Controls Locked
        </h2>
        <p className="text-xs text-[#607D8B] dark:text-[#B0BEC5] mb-5">
          Controls are locked to prevent accidental number draws during presentation.
        </p>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="password"
              placeholder="Press Unlock or enter PIN"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D6E4F0] dark:border-[#26354A] bg-[#F5FAFF] dark:bg-[#0B1220] text-[#17324D] dark:text-[#F8FAFC] text-sm text-center focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20 transition-all font-mono"
            />
          </div>

          {error && (
            <p className="text-xs text-[#D32F2F] font-medium">Incorrect PIN. Try again.</p>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleUnlockAttempt}
            className="w-full font-bold shadow-md"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Controls</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
