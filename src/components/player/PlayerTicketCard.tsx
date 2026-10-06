import React, { useState } from 'react';
import { CardTheme, GameConfig, PlayerCard, PrizeCategory } from '../../types/tambola';
import { verifyCardAchievement } from '../../services/gameEngine';
import { Button } from '../common/Button';
import { Sparkles, Check, Trophy } from 'lucide-react';

export interface PlayerTicketCardProps {
  card: PlayerCard;
  playerName: string;
  calledNumbers: number[];
  currentNumber: number | null;
  config: GameConfig;
  wonCategories: PrizeCategory[];
  fullHouseEligible: boolean;
  onClaimPrize?: (category: PrizeCategory) => void;
  interactiveMarks?: boolean;
}

const THEME_STYLES: Record<
  CardTheme,
  {
    border: string;
    headerBg: string;
    gridBg: string;
    calledCell: string;
    textAccent: string;
  }
> = {
  royalPurple: {
    border: 'border-purple-500/50',
    headerBg: 'bg-gradient-to-r from-purple-900 to-indigo-900',
    gridBg: 'bg-purple-950/20',
    calledCell: 'bg-purple-500/30 text-purple-200 border-purple-400',
    textAccent: 'text-purple-300',
  },
  oceanBlue: {
    border: 'border-sky-500/50',
    headerBg: 'bg-gradient-to-r from-blue-900 to-cyan-900',
    gridBg: 'bg-sky-950/20',
    calledCell: 'bg-sky-500/30 text-sky-200 border-sky-400',
    textAccent: 'text-sky-300',
  },
  emeraldGreen: {
    border: 'border-emerald-500/50',
    headerBg: 'bg-gradient-to-r from-emerald-900 to-teal-900',
    gridBg: 'bg-emerald-950/20',
    calledCell: 'bg-emerald-500/30 text-emerald-200 border-emerald-400',
    textAccent: 'text-emerald-300',
  },
  sunsetOrange: {
    border: 'border-orange-500/50',
    headerBg: 'bg-gradient-to-r from-orange-900 to-amber-900',
    gridBg: 'bg-orange-950/20',
    calledCell: 'bg-orange-500/30 text-orange-200 border-orange-400',
    textAccent: 'text-orange-300',
  },
  rubyRed: {
    border: 'border-rose-500/50',
    headerBg: 'bg-gradient-to-r from-rose-900 to-pink-900',
    gridBg: 'bg-rose-950/20',
    calledCell: 'bg-rose-500/30 text-rose-200 border-rose-400',
    textAccent: 'text-rose-300',
  },
  vibrantPink: {
    border: 'border-pink-500/50',
    headerBg: 'bg-gradient-to-r from-pink-900 to-purple-900',
    gridBg: 'bg-pink-950/20',
    calledCell: 'bg-pink-500/30 text-pink-200 border-pink-400',
    textAccent: 'text-pink-300',
  },
  goldenAmber: {
    border: 'border-amber-500/50',
    headerBg: 'bg-gradient-to-r from-amber-900 to-yellow-900',
    gridBg: 'bg-amber-950/20',
    calledCell: 'bg-amber-500/30 text-amber-200 border-amber-400',
    textAccent: 'text-amber-300',
  },
  tealCyan: {
    border: 'border-teal-500/50',
    headerBg: 'bg-gradient-to-r from-teal-900 to-cyan-900',
    gridBg: 'bg-teal-950/20',
    calledCell: 'bg-teal-500/30 text-teal-200 border-teal-400',
    textAccent: 'text-teal-300',
  },
};

export const PlayerTicketCard: React.FC<PlayerTicketCardProps> = ({
  card,
  playerName,
  calledNumbers,
  currentNumber,
  config,
  wonCategories,
  fullHouseEligible,
  onClaimPrize,
  interactiveMarks = true,
}) => {
  const [manualMarks, setManualMarks] = useState<Set<number>>(new Set());
  const calledSet = React.useMemo(() => new Set(calledNumbers), [calledNumbers]);
  const theme = THEME_STYLES[card.colorTheme] || THEME_STYLES.royalPurple;

  // Toggle player manual mark
  const toggleMark = (num: number) => {
    if (!interactiveMarks) return;
    setManualMarks((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  // Check achievements against called numbers
  const fastFiveAchieved = config.prizes.fastFive?.enabled
    ? verifyCardAchievement(card, 'fastFive', calledNumbers, config).completed
    : false;
  const line1Achieved = verifyCardAchievement(card, 'firstLine', calledNumbers, config).completed;
  const line2Achieved = verifyCardAchievement(card, 'secondLine', calledNumbers, config).completed;
  const line3Achieved = verifyCardAchievement(card, 'thirdLine', calledNumbers, config).completed;
  const fullHouseAchieved = verifyCardAchievement(card, 'fullHouse', calledNumbers, config).completed;
  const lastFiveAchieved = config.prizes.lastFive?.enabled && config.prizes.lastFive.winners > 0
    ? verifyCardAchievement(card, 'lastFive', calledNumbers, config).completed
    : false;

  // Check eligibility for claims
  const hasWonALine = wonCategories.some((c) =>
    ['firstLine', 'secondLine', 'thirdLine'].includes(c)
  );

  const canClaimFastFive =
    fastFiveAchieved &&
    Boolean(config.prizes.fastFive?.enabled && config.prizes.fastFive.winners > 0) &&
    !wonCategories.includes('fastFive');

  const canClaimLine1 =
    line1Achieved &&
    Boolean(config.prizes.firstLine?.enabled && config.prizes.firstLine.winners > 0) &&
    !hasWonALine &&
    !wonCategories.includes('firstLine');

  const canClaimLine2 =
    line2Achieved &&
    Boolean(config.prizes.secondLine?.enabled && config.prizes.secondLine.winners > 0) &&
    !hasWonALine &&
    !wonCategories.includes('secondLine');

  const canClaimLine3 =
    line3Achieved &&
    Boolean(config.prizes.thirdLine?.enabled && config.prizes.thirdLine.winners > 0) &&
    !hasWonALine &&
    !wonCategories.includes('thirdLine');

  const canClaimFullHouse =
    fullHouseAchieved &&
    Boolean(config.prizes.fullHouse?.enabled && config.prizes.fullHouse.winners > 0) &&
    !wonCategories.includes('fullHouse') &&
    (fullHouseEligible || (!hasWonALine && !config.lineWinnerFullHouseEligibility));

  const canClaimLastFive =
    lastFiveAchieved &&
    Boolean(config.prizes.lastFive?.enabled && config.prizes.lastFive.winners > 0) &&
    !wonCategories.includes('lastFive');

  const totalCardCalled = card.allNumbers.filter((n) => calledSet.has(n)).length;

  return (
    <div
      className={`rounded-3xl border-2 ${theme.border} bg-slate-900 shadow-2xl overflow-hidden transition-all`}
    >
      {/* Ticket Header */}
      <div
        className={`${theme.headerBg} px-4 sm:px-6 py-3 border-b ${theme.border} flex items-center justify-between text-xs`}
      >
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm tracking-wide">
            {playerName}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/30 text-white font-mono-nums font-semibold">
            Ticket #{card.ticketNumber}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono-nums">
          <span className="text-slate-300">Marked:</span>
          <span className="font-black text-amber-400 text-sm">
            {totalCardCalled} / 15
          </span>
        </div>
      </div>

      {/* Ticket Grid Table: 3 rows */}
      <div className={`p-3 sm:p-5 ${theme.gridBg}`}>
        <div className="grid grid-rows-3 gap-2">
          {card.grid.map((row, rowIdx) => {
            const isRowComplete =
              rowIdx === 0 ? line1Achieved : rowIdx === 1 ? line2Achieved : line3Achieved;

            return (
              <div
                key={rowIdx}
                className={`grid grid-cols-9 sm:grid-cols-10 gap-1 sm:gap-2 p-1 rounded-xl transition-colors ${
                  isRowComplete ? 'bg-amber-400/10 ring-1 ring-amber-400/40' : ''
                }`}
              >
                {row.map((cellValue, colIdx) => {
                  if (cellValue === null) {
                    return (
                      <div
                        key={colIdx}
                        className="aspect-square rounded-lg bg-slate-950/40 border border-slate-900"
                      />
                    );
                  }

                  const isCalled = calledSet.has(cellValue);
                  const isCurrent = currentNumber === cellValue;
                  const isManuallyMarked = manualMarks.has(cellValue);

                  return (
                    <button
                      key={colIdx}
                      type="button"
                      onClick={() => toggleMark(cellValue)}
                      aria-label={`Ticket number ${cellValue}${isCalled ? ', called' : ''}${isManuallyMarked ? ', marked' : ''}`}
                      className={`aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center font-mono-nums font-extrabold text-xs sm:text-base relative transition-all duration-150 select-none ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105 z-10 animate-pulse-gold'
                          : isCalled
                          ? 'bg-gradient-to-tr from-amber-500/30 to-amber-400/40 border-2 border-amber-400 text-amber-300 shadow-sm'
                          : isManuallyMarked
                          ? 'bg-indigo-600/30 border border-indigo-400 text-indigo-200'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{cellValue}</span>
                      {isCalled && (
                        <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 absolute bottom-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Won categories badge strip */}
      {wonCategories.length > 0 && (
        <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-400">Prizes Won:</span>
          {wonCategories.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-semibold text-[11px]"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Claim Action Buttons */}
      {onClaimPrize && (
        <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center gap-2 justify-center">
          {canClaimFastFive && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onClaimPrize('fastFive')}
              className="text-xs font-bold animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              CLAIM FAST FIVE
            </Button>
          )}

          {canClaimLine1 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onClaimPrize('firstLine')}
              className="text-xs font-bold"
            >
              CLAIM FIRST LINE
            </Button>
          )}

          {canClaimLine2 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onClaimPrize('secondLine')}
              className="text-xs font-bold"
            >
              CLAIM SECOND LINE
            </Button>
          )}

          {canClaimLine3 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onClaimPrize('thirdLine')}
              className="text-xs font-bold"
            >
              CLAIM THIRD LINE
            </Button>
          )}

          {canClaimFullHouse && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onClaimPrize('fullHouse')}
              className="text-xs font-black shadow-lg shadow-amber-500/40 animate-pulse"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              CLAIM FULL HOUSE!
            </Button>
          )}

          {canClaimLastFive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onClaimPrize('lastFive')}
              className="text-xs font-bold"
            >
              CLAIM LAST FIVE
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
