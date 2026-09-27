import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameHeader } from '../components/game/GameHeader';
import { CurrentNumberDisplay } from '../components/game/CurrentNumberDisplay';
import { TambolaBoard } from '../components/game/TambolaBoard';
import { CallNextButton } from '../components/game/CallNextButton';
import { CallHistory } from '../components/game/CallHistory';
import { PrizeStatusPanel } from '../components/game/PrizeStatusPanel';
import { WinnerList } from '../components/game/WinnerList';
import { ClaimModal } from '../components/game/ClaimModal';
import { PendingClaimsBar } from '../components/game/PendingClaimsBar';
import { VirtualPlayerList } from '../components/player/VirtualPlayerList';
import { PlayerTicketCard } from '../components/player/PlayerTicketCard';
import { NumberPopModal } from '../components/game/NumberPopModal';
import { HostLockOverlay } from '../components/game/HostLockOverlay';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Player, PrizeCategory } from '../types/tambola';
import { Trophy, Tv, X } from 'lucide-react';

export const HostGame: React.FC = () => {
  const {
    gameState,
    isCalling,
    justPoppedNumber,
    isMarkedOnBoard,
    dismissPopEffect,
    callNext,
    resumeAfterPause,
    recordManualWinner,
    verifyPendingClaim,
    rejectPendingClaim,
    addVirtualPlayer,
    endGame,
    resetGame,
    toggleVoice,
    toggleSound,
    repeatCurrentVoice,
    speakRulesNow,
  } = useGame();

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isHostLocked, setIsHostLocked] = useState(false);

  if (!gameState) return null;

  const isVirtual = gameState.config.mode === 'virtual';

  const handleManualClaimWinner = (
    playerName: string,
    category: PrizeCategory,
    playerId?: string,
    ticketNumber?: number
  ) => {
    recordManualWinner(playerName, category, playerId, ticketNumber);
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] dark:bg-[#0B1220] text-[#17324D] dark:text-[#F8FAFC] flex flex-col justify-between transition-colors">
      {/* Top Header */}
      <GameHeader
        gameCode={gameState.gameCode}
        config={gameState.config}
        onToggleVoice={toggleVoice}
        onToggleSound={toggleSound}
        onEndGame={endGame}
        onResetGame={resetGame}
        onOpenRules={() => setShowRulesModal(true)}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        isHostLocked={isHostLocked}
        onToggleHostLock={() => setIsHostLocked(!isHostLocked)}
      />

      {/* Main Responsive Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Presentation Banner if TV Mode active */}
        {isPresentationMode && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#1565C0] shadow-md">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1565C0] dark:text-[#64B5F6]">
              <Tv className="w-5 h-5 text-[#1976D2]" />
              <span>Game Night / TV Display Mode Active</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPresentationMode(false)}
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit TV Mode</span>
            </Button>
          </div>
        )}

        {/* Pending Claims Notification Banner */}
        <PendingClaimsBar
          claims={gameState.pendingClaims}
          onVerify={verifyPendingClaim}
          onReject={rejectPendingClaim}
        />

        {/* All Prizes Claimed Banner */}
        {gameState.status === 'allPrizesClaimed' && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#2E7D32] text-center shadow-lg animate-call-pop">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#2E7D32] dark:text-[#66BB6A]">
              <Trophy className="w-6 h-6" />
              <h2 className="text-xl font-bold font-heading">
                All Configured Winners Identified!
              </h2>
            </div>
            <p className="text-sm text-[#607D8B] dark:text-[#B0BEC5] mb-4 max-w-lg mx-auto">
              All configured prize spots have been claimed! You may continue calling numbers or conclude the game to view full results.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={callNext}
                disabled={isCalling}
              >
                Continue Calling Numbers
              </Button>
              <Button variant="danger" size="md" onClick={endGame}>
                End Game &amp; View Results
              </Button>
            </div>
          </div>
        )}

        {/* 2-Column Dashboard Layout: Left (Current Number & Next Button) | Right (Tambola Board) */}
        <div className={`grid grid-cols-1 ${isPresentationMode ? 'lg:grid-cols-12 gap-8' : 'lg:grid-cols-12 gap-6'}`}>
          {/* Left Column: Current Number Display + Call Next Button */}
          <div className={`${isPresentationMode ? 'lg:col-span-5' : 'lg:col-span-4'} flex flex-col gap-5`}>
            <CurrentNumberDisplay
              currentNumber={gameState.currentNumber}
              previousNumber={gameState.previousNumber}
              calledCount={gameState.calledNumbers.length}
              numberRange={gameState.config.numberRange}
              callingStyle={gameState.config.voiceSettings.callingStyle}
              onRepeatVoice={repeatCurrentVoice}
              isPresentationMode={isPresentationMode}
            />

            {!isHostLocked && (
              <CallNextButton
                status={gameState.status}
                calledCount={gameState.calledNumbers.length}
                numberRange={gameState.config.numberRange}
                isCalling={isCalling}
                onCallNext={callNext}
                onResumeAfterPause={resumeAfterPause}
              />
            )}
          </div>

          {/* Center Column: Tambola Ordered Master Board */}
          <div className={`${isPresentationMode ? 'lg:col-span-7' : 'lg:col-span-8'} flex flex-col gap-6`}>
            <TambolaBoard
              numberRange={gameState.config.numberRange}
              calledNumbers={gameState.calledNumbers}
              currentNumber={gameState.currentNumber}
              justCalledNumber={isMarkedOnBoard ? justPoppedNumber : null}
              isPresentationMode={isPresentationMode}
            />
          </div>
        </div>

        {/* Bottom Section: Call History (hidden in presentation mode) */}
        {!isPresentationMode && (
          <CallHistory
            calledNumbers={gameState.calledNumbers}
            currentNumber={gameState.currentNumber}
          />
        )}

        {/* Side Panels: Prize Status & Winner List & Virtual Players Grid (hidden in presentation mode) */}
        {!isPresentationMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Prize Status */}
            <PrizeStatusPanel
              config={gameState.config}
              winners={gameState.winners}
              onOpenManualClaim={() => setShowClaimModal(true)}
            />

            {/* Winner History */}
            <WinnerList winners={gameState.winners} />

            {/* Virtual Players (in virtual mode) */}
            {isVirtual && (
              <VirtualPlayerList
                players={gameState.players}
                calledNumbers={gameState.calledNumbers}
                onAddSimulatedPlayer={() => addVirtualPlayer()}
                onViewPlayerCard={(p) => setInspectedPlayer(p)}
              />
            )}
          </div>
        )}
      </main>

      {/* Pop Up Number Animation Overlay Modal */}
      <NumberPopModal
        number={justPoppedNumber}
        numberRange={gameState.config.numberRange}
        callingStyle={gameState.config.voiceSettings.callingStyle}
        isMarkedOnBoard={isMarkedOnBoard}
        onAnimationEnd={dismissPopEffect}
      />

      {/* Host Lock Screen Overlay */}
      <HostLockOverlay
        isLocked={isHostLocked}
        onUnlock={() => setIsHostLocked(false)}
        gameCode={gameState.gameCode}
      />

      {/* Manual Winner Claim Modal */}
      <ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        gameState={gameState}
        onConfirmWinner={handleManualClaimWinner}
      />

      {/* Inspect Virtual Player Ticket Modal */}
      {inspectedPlayer && (
        <Modal
          isOpen={true}
          onClose={() => setInspectedPlayer(null)}
          title={`Ticket #${inspectedPlayer.card.ticketNumber} — ${inspectedPlayer.name}`}
          subtitle="Real-time ticket marking and line achievements"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <PlayerTicketCard
              card={inspectedPlayer.card}
              playerName={inspectedPlayer.name}
              calledNumbers={gameState.calledNumbers}
              currentNumber={gameState.currentNumber}
              config={gameState.config}
              wonCategories={inspectedPlayer.wonCategories}
              fullHouseEligible={inspectedPlayer.fullHouseEligible}
              interactiveMarks={false}
            />

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="md" onClick={() => setInspectedPlayer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rules Modal */}
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        title="Tambola Game Rules & Configuration"
        subtitle={`Session Rules for ${gameState.gameCode}`}
        maxWidth="lg"
      >
        <div className="space-y-3.5 text-xs sm:text-sm text-[#17324D] dark:text-[#F8FAFC] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A]">
            <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] block mb-1">Configured Range</span>
            Numbers {gameState.config.numberRange.start} through {gameState.config.numberRange.end} are drawn completely at random without duplicates. The board is displayed in strict numerical order.
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A]">
            <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] block mb-1">Top of the House</span>
            The maximum number in the range ({gameState.config.numberRange.end}) dynamically serves as the &ldquo;Top of the House&rdquo;.
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A]">
            <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] block mb-1">First Five Pause</span>
            After the 5th number is drawn, play pauses to allow players to check tickets. The host must press &ldquo;CHECK / CONTINUE&rdquo; to proceed.
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A]">
            <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] block mb-1">Strict Line Rule</span>
            A player who has won one line (e.g. First Line) cannot win another line (e.g. Second or Third Line) using the same card.
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5FAFF] dark:bg-[#0B1220] border border-[#D6E4F0] dark:border-[#26354A]">
            <span className="font-bold text-[#1565C0] dark:text-[#64B5F6] block mb-1">Full House Eligibility</span>
            {gameState.config.lineWinnerFullHouseEligibility
              ? 'Players who have won a line prize CAN continue to claim Full House.'
              : 'Players who have won any line prize are LOCKED OUT from Full House.'}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#D6E4F0] dark:border-[#26354A]">
            <Button variant="outline" size="sm" onClick={speakRulesNow}>
              Re-speak Rules Aloud
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowRulesModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
