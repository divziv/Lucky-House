import React from 'react';
import { ClaimRequest } from '../../types/tambola';
import { PRIZE_LABELS } from '../../services/gameEngine';
import { Button } from '../common/Button';
import { Bell, Check, X } from 'lucide-react';

export interface PendingClaimsBarProps {
  claims: ClaimRequest[];
  onVerify: (claim: ClaimRequest) => void;
  onReject: (claim: ClaimRequest) => void;
}

export const PendingClaimsBar: React.FC<PendingClaimsBarProps> = ({
  claims,
  onVerify,
  onReject,
}) => {
  if (claims.length === 0) return null;

  return (
    <div className="w-full bg-[#E3F2FD] dark:bg-[#172033] border-2 border-[#1976D2] rounded-2xl p-4 shadow-lg mb-4 animate-call-pop transition-colors">
      <div className="flex items-center gap-2 mb-3 text-[#1565C0] dark:text-[#64B5F6] font-bold text-sm">
        <Bell className="w-4 h-4 animate-bounce text-[#1976D2]" />
        <span>Incoming Player Winner Claims ({claims.length})</span>
      </div>

      <div className="space-y-2.5">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#111827] rounded-xl border border-[#D6E4F0] dark:border-[#26354A] shadow-xs"
          >
            <div className="text-sm">
              <span className="font-extrabold text-[#1565C0] dark:text-[#64B5F6]">{claim.playerName}</span>
              <span className="text-[#17324D] dark:text-[#F8FAFC]"> is claiming </span>
              <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] uppercase bg-[#E3F2FD] dark:bg-[#172033] px-2 py-0.5 rounded-md border border-[#D6E4F0] dark:border-[#26354A]">
                {PRIZE_LABELS[claim.category]}
              </span>
              {claim.ticketNumber && (
                <span className="text-xs text-[#607D8B] dark:text-[#B0BEC5] ml-2">
                  (Ticket #{claim.ticketNumber})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onVerify(claim)}
                className="py-1 px-3 min-h-[34px] text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Confirm Winner
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onReject(claim)}
                className="py-1 px-3 min-h-[34px] text-xs"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
