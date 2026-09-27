import React, { useState } from 'react';
import { GameConfig } from '../../types/tambola';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ThemeToggle } from '../common/ThemeToggle';
import { OfflineIndicator } from '../common/OfflineIndicator';
import {
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Copy,
  Check,
  Flag,
  FileText,
  Smartphone,
  RotateCcw,
  Tv,
  Lock,
  Unlock,
  BookOpen,
} from 'lucide-react';

export interface GameHeaderProps {
  gameCode: string;
  config: GameConfig;
  onToggleVoice: () => void;
  onToggleSound: () => void;
  onEndGame: () => void;
  onResetGame: () => void;
  onOpenRules: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  isHostLocked?: boolean;
  onToggleHostLock?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameCode,
  config,
  onToggleVoice,
  onToggleSound,
  onEndGame,
  onResetGame,
  onOpenRules,
  isPresentationMode = false,
  onTogglePresentationMode,
  isHostLocked = false,
  onToggleHostLock,
}) => {
  const [copied, setCopied] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="w-full bg-white dark:bg-[#111827] border-b border-[#D6E4F0] dark:border-[#26354A] px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Mode: 🔵 Lucky House */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1565C0] dark:bg-[#42A5F5] inline-block shadow-sm" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1565C0] dark:text-[#64B5F6] font-heading leading-tight">
                  Lucky House
                </h1>
                <p className="hidden md:block text-[11px] font-semibold text-[#607D8B] dark:text-[#B0BEC5] tracking-wide">
                  Tambola Time - Call. Mark. Claim. Celebrate!
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5FAFF] dark:bg-[#172033] border border-[#D6E4F0] dark:border-[#26354A] text-xs font-medium text-[#17324D] dark:text-[#F8FAFC]">
              {config.mode === 'physical' ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-[#1976D2] dark:text-[#64B5F6]" />
                  <span>Physical Paper</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#1976D2] dark:text-[#64B5F6]" />
                  <span>Virtual Game</span>
                </>
              )}
            </div>
          </div>

          {/* Game Code & Offline Indicator */}
          <div className="flex items-center gap-2.5">
            <OfflineIndicator />

            <div className="flex items-center gap-2 bg-[#F5FAFF] dark:bg-[#0B1220] px-3 py-1.5 rounded-xl border border-[#D6E4F0] dark:border-[#26354A]">
              <span className="text-[11px] uppercase tracking-wider text-[#607D8B] dark:text-[#B0BEC5] font-semibold">
                Game:
              </span>
              <span className="text-base font-extrabold text-[#1565C0] dark:text-[#64B5F6] font-mono-nums tracking-wider">
                {gameCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy Game Code"
                className="p-1 text-[#607D8B] hover:text-[#1565C0] dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Copy Game Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Controls: Audio, Presentation, Lock, Theme, Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Presentation Mode / Game Night TV Button */}
            {onTogglePresentationMode && (
              <button
                type="button"
                onClick={onTogglePresentationMode}
                title={isPresentationMode ? 'Exit Game Display Mode' : 'Large Screen / Game Night Mode'}
                aria-label="Toggle presentation mode"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isPresentationMode
                    ? 'bg-[#1565C0] text-white border-[#1565C0]'
                    : 'bg-white dark:bg-[#111827] border-[#D6E4F0] dark:border-[#26354A] text-[#17324D] dark:text-[#F8FAFC] hover:bg-[#E3F2FD] dark:hover:bg-[#172033]'
                }`}
              >
                <Tv className="w-4 h-4" />
              </button>
            )}

            {/* Host Controls Lock Toggle */}
            {onToggleHostLock && (
              <button
                type="button"
                onClick={onToggleHostLock}
                title={isHostLocked ? 'Unlock Host Controls' : 'Lock Host Controls'}
                aria-label="Lock or unlock host controls"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isHostLocked
                    ? 'bg-[#F9A825]/20 text-[#F9A825] border-[#F9A825]'
                    : 'bg-white dark:bg-[#111827] border-[#D6E4F0] dark:border-[#26354A] text-[#17324D] dark:text-[#F8FAFC] hover:bg-[#E3F2FD] dark:hover:bg-[#172033]'
                }`}
              >
                {isHostLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            )}

            {/* Voice Mute / Unmute */}
            <button
              type="button"
              onClick={onToggleVoice}
              title={config.voiceSettings.enabled ? 'Mute Caller Voice' : 'Enable Caller Voice'}
              aria-label={config.voiceSettings.enabled ? 'Mute Caller Voice' : 'Enable Caller Voice'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                config.voiceSettings.enabled
                  ? 'bg-[#E3F2FD] dark:bg-[#172033] border-[#1976D2] text-[#1565C0] dark:text-[#64B5F6]'
                  : 'bg-white dark:bg-[#111827] border-[#D6E4F0] dark:border-[#26354A] text-[#607D8B] dark:text-[#B0BEC5]'
              }`}
            >
              {config.voiceSettings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={config.soundSettings.enabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              aria-label={config.soundSettings.enabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                config.soundSettings.enabled
                  ? 'bg-[#E3F2FD] dark:bg-[#172033] border-[#1976D2] text-[#1565C0] dark:text-[#64B5F6]'
                  : 'bg-white dark:bg-[#111827] border-[#D6E4F0] dark:border-[#26354A] text-[#607D8B] dark:text-[#B0BEC5]'
              }`}
            >
              {config.soundSettings.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            {/* Rules Button */}
            <Button variant="outline" size="sm" onClick={onOpenRules} className="hidden sm:inline-flex">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Rules</span>
            </Button>

            {/* Restart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="hidden md:inline-flex"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </Button>

            {/* End Game Button */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowEndDialog(true)}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>End Game</span>
            </Button>
          </div>
        </div>
      </header>

      {/* End Game Confirm Dialog */}
      <ConfirmDialog
        isOpen={showEndDialog}
        title="End Tambola Game?"
        message="Are you sure you want to end this game? You will proceed to the final results screen displaying all winners and stats."
        confirmLabel="End & View Results"
        confirmVariant="danger"
        onConfirm={() => {
          setShowEndDialog(false);
          onEndGame();
        }}
        onCancel={() => setShowEndDialog(false)}
      />

      {/* Reset Game Confirm Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Restart Game?"
        message="This will reshuffle the numbers pool and reset all called numbers and winners. Player cards will be retained."
        confirmLabel="Restart Session"
        confirmVariant="primary"
        onConfirm={() => {
          setShowResetDialog(false);
          onResetGame();
        }}
        onCancel={() => setShowResetDialog(false)}
      />
    </>
  );
};
