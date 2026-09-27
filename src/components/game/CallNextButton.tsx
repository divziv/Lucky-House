import React from 'react';
import { GameStatus, NumberRange } from '../../types/tambola';
import { Button } from '../common/Button';
import { Sparkles, Play, CheckCircle2, AlertOctagon } from 'lucide-react';

export interface CallNextButtonProps {
  status: GameStatus;
  calledCount: number;
  numberRange: NumberRange;
  isCalling: boolean;
  onCallNext: () => void;
  onResumeAfterPause: () => void;
}

export const CallNextButton: React.FC<CallNextButtonProps> = ({
  status,
  calledCount,
  numberRange,
  isCalling,
  onCallNext,
  onResumeAfterPause,
}) => {
  const totalPool = numberRange.end - numberRange.start + 1;
  const isExhausted = calledCount >= totalPool;

  // 1. First Five Numbers Pause Special View
  if (status === 'firstFivePaused') {
    return (
      <div className="w-full p-5 rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#1976D2] text-center shadow-lg transition-colors animate-call-pop">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0] animate-ping" />
          <h3 className="text-xl font-bold text-[#1565C0] dark:text-[#64B5F6] font-heading">
            5 Numbers Called!
          </h3>
        </div>

        <p className="text-sm text-[#17324D] dark:text-[#F8FAFC] mb-4 max-w-md mx-auto">
          Please check your tickets for Fast Five. Press continue when ready.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={onResumeAfterPause}
          className="shadow-md px-8 py-3.5 text-base font-bold"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          Continue Game
        </Button>
      </div>
    );
  }

  // 2. Pool Exhausted State
  if (isExhausted) {
    return (
      <div className="w-full p-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] text-center shadow-sm transition-colors">
        <div className="flex items-center justify-center gap-2 text-[#1565C0] dark:text-[#64B5F6] font-semibold text-sm">
          <AlertOctagon className="w-4 h-4 text-[#F9A825]" />
          All {totalPool} Numbers in Range ({numberRange.start}–{numberRange.end}) Have Been Called!
        </div>
      </div>
    );
  }

  // 3. Normal Calling Button — Background #1565C0, text white, hover #0D47A1
  return (
    <div className="w-full">
      <Button
        variant="primary"
        size="xl"
        disabled={isCalling}
        onClick={onCallNext}
        className="w-full text-lg sm:text-xl font-bold tracking-wide shadow-lg shadow-blue-800/25 border-2 border-[#1976D2] transition-transform active:scale-[0.98]"
      >
        <Sparkles className="w-5 h-5 fill-current animate-spin" style={{ animationDuration: '4s' }} />
        <span>Next Number</span>
        <Play className="w-5 h-5 fill-current" />
      </Button>
    </div>
  );
};
