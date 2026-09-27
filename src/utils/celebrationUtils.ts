import confetti from 'canvas-confetti';
import { soundFX } from './soundUtils';

/**
 * Triggers a multi-stage celebratory confetti animation effect and synthesized applause/claps sound
 * whenever a player claims or wins a category.
 */
export function triggerWinnerCelebration(categoryName?: string, playerName?: string) {
  // 1. Play synthesized claps and victory chimes
  soundFX.playClaps(0.7, 2.5);

  // 2. High-energy celebratory confetti cannons
  try {
    // Stage 1: Dynamic Center Cannon Burst (White & Blue palette + Gold/Green accents)
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#1565C0', '#1976D2', '#64B5F6', '#2E7D32', '#F9A825', '#FFFFFF'],
    });

    // Stage 2: Synchronized Left & Right celebratory blasts
    setTimeout(() => {
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#1565C0', '#1976D2', '#64B5F6', '#2E7D32', '#FFFFFF'],
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#1565C0', '#1976D2', '#64B5F6', '#2E7D32', '#FFFFFF'],
      });
    }, 280);

    // Stage 3: Sparkle Shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 120,
        origin: { y: 0.25 },
        shapes: ['circle', 'square'],
        colors: ['#1976D2', '#64B5F6', '#F9A825', '#FFFFFF'],
      });
    }, 600);
  } catch {}
}
