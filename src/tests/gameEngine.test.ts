import { describe, expect, it } from 'vitest';
import {
  areAllConfiguredPrizesWon,
  callNextNumber,
  createNewGame,
  getDefaultGameConfig,
  isPlayerEligibleForCategory,
  isPrizeAvailable,
  recordWinner,
  verifyCardAchievement,
} from '../services/gameEngine';
import { generatePlayerCard } from '../services/cardGenerator';
import { GameConfig, Player } from '../types/tambola';
import {
  createShuffledCallingPool,
  generateOrderedNumberBoard,
  validateNumberRange,
} from '../utils/numberRangeUtils';
import { getNumberAnnouncement, getNumberDescription } from '../utils/numberCallPhrases';
import { buildDigitAnnouncement } from '../utils/digitAnnouncement';
import { numberToWords } from '../utils/numberToWords';

describe('Tambola Royal - Flexible Ranges & Family-Friendly Caller', () => {
  describe('Board ordering vs calling pool', () => {
    it('generates visual board in strict ascending order for various ranges', () => {
      // 1–90
      const board90 = generateOrderedNumberBoard(1, 90);
      expect(board90[0]).toBe(1);
      expect(board90[board90.length - 1]).toBe(90);
      expect(board90.length).toBe(90);
      expect(board90).toEqual(Array.from({ length: 90 }, (_, i) => i + 1));

      // 1–100
      const board100 = generateOrderedNumberBoard(1, 100);
      expect(board100[0]).toBe(1);
      expect(board100[board100.length - 1]).toBe(100);
      expect(board100.length).toBe(100);

      // 10–75
      const board10_75 = generateOrderedNumberBoard(10, 75);
      expect(board10_75[0]).toBe(10);
      expect(board10_75[board10_75.length - 1]).toBe(75);
      expect(board10_75.length).toBe(66);

      // 20–80
      const board20_80 = generateOrderedNumberBoard(20, 80);
      expect(board20_80[0]).toBe(20);
      expect(board20_80[board20_80.length - 1]).toBe(80);
    });

    it('shuffles calling pool independently from the ordered board with zero duplicates', () => {
      const start = 10;
      const end = 50;
      const pool = createShuffledCallingPool(start, end);
      const total = end - start + 1;

      expect(pool.length).toBe(total);
      expect(new Set(pool).size).toBe(total);
      expect(Math.min(...pool)).toBe(start);
      expect(Math.max(...pool)).toBe(end);

      // Verify calling pool contains all numbers without repetition
      const ordered = generateOrderedNumberBoard(start, end);
      expect([...pool].sort((a, b) => a - b)).toEqual(ordered);
    });

    it('validates ranges correctly', () => {
      expect(validateNumberRange(1, 90).valid).toBe(true);
      expect(validateNumberRange(10, 75).valid).toBe(true);
      expect(validateNumberRange(90, 10).valid).toBe(false);
      expect(validateNumberRange(1, 10).valid).toBe(false); // less than 15 numbers
      expect(validateNumberRange(1, 1500).valid).toBe(false); // exceeds MAX_NUMBER 1000
    });
  });

  describe('Special Family-Friendly Calling Phrases', () => {
    const defaultRange = { start: 1, end: 90 };

    it('announces number 1 as leader at the very beginning', () => {
      const desc = getNumberDescription(1, defaultRange, 'familyFriendly');
      expect(desc.primary.toLowerCase()).toContain('leader at the very beginning');
      expect(desc.isTopOfHouse).toBe(false);
    });

    it('announces number 7 as lucky number seven', () => {
      const desc = getNumberDescription(7, defaultRange, 'familyFriendly');
      expect(desc.primary).toBe('Lucky number seven');
      const ann = getNumberAnnouncement(7, defaultRange, 'familyFriendly');
      expect(ann.spokenPhrases[0]).toBe('Lucky number seven');
      expect(ann.spokenPhrases[1]).toContain('Single digit, seven');
    });

    it('announces number 13 with positive not-so-unlucky phrase', () => {
      const desc = getNumberDescription(13, defaultRange, 'familyFriendly');
      expect(desc.primary.toLowerCase()).toContain('not so unlucky');
    });

    it('announces number 25 as Silver Jubilee', () => {
      const desc = getNumberDescription(25, defaultRange, 'familyFriendly');
      expect(desc.primary).toContain('Silver Jubilee');
    });

    it('announces number 50 as Half a century, Silver Jubilee', () => {
      const desc = getNumberDescription(50, defaultRange, 'familyFriendly');
      expect(desc.primary).toContain('Half a century');
    });

    it('announces number 77 as Hum Saath Saath Hai', () => {
      const desc = getNumberDescription(77, defaultRange, 'familyFriendly');
      expect(desc.primary).toContain('Hum Saath Saath Hai');
    });
  });

  describe('Dynamic Top of the House Logic', () => {
    it('dynamically calls the configured range end Top of the House', () => {
      // 1–70
      const desc70 = getNumberDescription(70, { start: 1, end: 70 });
      expect(desc70.primary).toBe('Top of the House, seventy');
      expect(desc70.isTopOfHouse).toBe(true);

      // 1–80
      const desc80 = getNumberDescription(80, { start: 1, end: 80 });
      expect(desc80.primary).toBe('Top of the House, eighty');
      expect(desc80.isTopOfHouse).toBe(true);

      // 1–90
      const desc90 = getNumberDescription(90, { start: 1, end: 90 });
      expect(desc90.primary).toBe('Top of the House, ninety');
      expect(desc90.isTopOfHouse).toBe(true);

      // 1–100
      const desc100 = getNumberDescription(100, { start: 1, end: 100 });
      expect(desc100.primary).toBe('Top of the House, one hundred');
      expect(desc100.isTopOfHouse).toBe(true);

      // 10–75
      const desc75 = getNumberDescription(75, { start: 10, end: 75 });
      expect(desc75.primary).toBe('Top of the House, seventy-five');
      expect(desc75.isTopOfHouse).toBe(true);

      // 20–80
      const desc80Custom = getNumberDescription(80, { start: 20, end: 80 });
      expect(desc80Custom.primary).toBe('Top of the House, eighty');
      expect(desc80Custom.isTopOfHouse).toBe(true);
    });

    it('prioritizes Top of the House over static phrases when number equals range end', () => {
      // When 77 is the range end (1–77)
      const desc77Top = getNumberDescription(77, { start: 1, end: 77 });
      expect(desc77Top.primary).toBe('Top of the House, seventy-seven');
      expect(desc77Top.isTopOfHouse).toBe(true);
      expect(desc77Top.secondary).toContain('Hum Saath Saath Hai');
    });
  });

  describe('Digit announcement and number-to-words utility', () => {
    it('converts numbers to words accurately up to 1000', () => {
      expect(numberToWords(1)).toBe('one');
      expect(numberToWords(7)).toBe('seven');
      expect(numberToWords(13)).toBe('thirteen');
      expect(numberToWords(22)).toBe('twenty-two');
      expect(numberToWords(25)).toBe('twenty-five');
      expect(numberToWords(50)).toBe('fifty');
      expect(numberToWords(69)).toBe('sixty-nine');
      expect(numberToWords(77)).toBe('seventy-seven');
      expect(numberToWords(90)).toBe('ninety');
      expect(numberToWords(100)).toBe('one hundred');
      expect(numberToWords(105)).toBe('one hundred and five');
      expect(numberToWords(250)).toBe('two hundred and fifty');
      expect(numberToWords(1000)).toBe('one thousand');
    });

    it('builds phonetic digit breakdowns for single, double, and triple digits', () => {
      expect(buildDigitAnnouncement(7)).toBe('Single digit, seven.');
      expect(buildDigitAnnouncement(22)).toBe('Double digit, two two, twenty-two.');
      expect(buildDigitAnnouncement(69)).toBe('Double digit, six nine, sixty-nine.');
      expect(buildDigitAnnouncement(105)).toBe('Triple digit, one zero five, one hundred and five.');
      expect(buildDigitAnnouncement(250)).toBe('Triple digit, two five zero, two hundred and fifty.');
    });
  });

  describe('Game Engine execution with flexible ranges', () => {
    it('starts game with custom range 10–75 and pauses on 5th number', () => {
      const config: GameConfig = {
        ...getDefaultGameConfig('physical'),
        numberRange: { start: 10, end: 75 },
      };

      let state = createNewGame(config);
      expect(state.numbersPool.length).toBe(66);

      const called = new Set<number>();
      for (let i = 1; i <= 5; i++) {
        const res = callNextNumber(state);
        expect(res.called).toBeGreaterThanOrEqual(10);
        expect(res.called).toBeLessThanOrEqual(75);
        expect(called.has(res.called!)).toBe(false);
        called.add(res.called!);
        state = res.nextState;
      }

      expect(state.status).toBe('firstFivePaused');
      expect(state.calledNumbers.length).toBe(5);
    });

    it('generates player tickets that conform to custom range bounds', () => {
      const range = { start: 20, end: 80 };
      const card = generatePlayerCard(1, range, 0);

      expect(card.allNumbers.length).toBe(15);
      card.allNumbers.forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(20);
        expect(n).toBeLessThanOrEqual(80);
      });
    });
  });
});
