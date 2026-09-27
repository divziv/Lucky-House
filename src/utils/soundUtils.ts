// Web Audio API Synthesized Sound Effects (No external audio file dependencies)

class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Resonant pop and draw chime effect played when a number is drawn
   */
  playNumberPop(volume: number = 0.55) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Crisp pop bubble sound
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();

      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(220, now);
      popOsc.frequency.exponentialRampToValueAtTime(920, now + 0.08);

      popGain.gain.setValueAtTime(volume * 0.6, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      popOsc.connect(popGain);
      popGain.connect(ctx.destination);

      popOsc.start(now);
      popOsc.stop(now + 0.14);

      // 2. Harmonious bright ring chime
      const ringOsc = ctx.createOscillator();
      const ringGain = ctx.createGain();

      ringOsc.type = 'triangle';
      ringOsc.frequency.setValueAtTime(659.25, now + 0.04); // E5
      ringOsc.frequency.exponentialRampToValueAtTime(987.77, now + 0.18); // B5

      ringGain.gain.setValueAtTime(0.001, now);
      ringGain.gain.setValueAtTime(volume * 0.5, now + 0.05);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      ringOsc.connect(ringGain);
      ringGain.connect(ctx.destination);

      ringOsc.start(now + 0.04);
      ringOsc.stop(now + 0.5);

      // 3. Shimmer overtone
      const sparkOsc = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      sparkOsc.type = 'sine';
      sparkOsc.frequency.setValueAtTime(1318.5, now + 0.07); // E6
      sparkGain.gain.setValueAtTime(0.001, now);
      sparkGain.gain.setValueAtTime(volume * 0.25, now + 0.08);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      sparkOsc.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      sparkOsc.start(now + 0.07);
      sparkOsc.stop(now + 0.38);
    } catch {}
  }

  playCallChime(volume: number = 0.5) {
    this.playNumberPop(volume);
  }

  playBoardStamp(volume: number = 0.45) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Thud/Stamp impact
      const stampOsc = ctx.createOscillator();
      const stampGain = ctx.createGain();

      stampOsc.type = 'triangle';
      stampOsc.frequency.setValueAtTime(320, now);
      stampOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      stampGain.gain.setValueAtTime(volume * 0.5, now);
      stampGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      stampOsc.connect(stampGain);
      stampGain.connect(ctx.destination);

      stampOsc.start(now);
      stampOsc.stop(now + 0.14);

      // 2. Confirmation high bell ping
      const pingOsc = ctx.createOscillator();
      const pingGain = ctx.createGain();

      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(1046.5, now + 0.02); // C6
      pingGain.gain.setValueAtTime(0.001, now);
      pingGain.gain.setValueAtTime(volume * 0.3, now + 0.03);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      pingOsc.connect(pingGain);
      pingGain.connect(ctx.destination);

      pingOsc.start(now + 0.02);
      pingOsc.stop(now + 0.32);
    } catch {}
  }

  playPauseNotice(volume: number = 0.5) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(volume * 0.35, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.38);
      });
    } catch {}
  }

  playWinFanfare(volume: number = 0.5) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(volume * 0.4, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.55);
      });
    } catch {}
  }

  /**
   * Synthesizes cheering and clapping applause sounds using multiple bandpass filtered noise bursts
   */
  playClaps(volume: number = 0.65, duration: number = 2.4) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Generate realistic handclap burst sequence
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const totalClaps = 32;
      for (let i = 0; i < totalClaps; i++) {
        const progress = i / totalClaps;
        // Natural distribution of claps building and settling
        const offset = progress * (duration * 0.88) + (Math.random() * 0.05 - 0.025);
        const clapTime = now + offset;

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        // Bandpass filter centered around natural hands slapping resonance (850Hz - 1500Hz)
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900 + Math.random() * 500, clapTime);
        filter.Q.setValueAtTime(2.2 + Math.random() * 1.5, clapTime);

        const gainNode = ctx.createGain();
        // Dynamic envelope with sharp percussive transient
        const clapGain = volume * (0.35 + Math.random() * 0.45);
        gainNode.gain.setValueAtTime(clapGain, clapTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.035 + Math.random() * 0.025);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseSource.start(clapTime);
        noiseSource.stop(clapTime + 0.07);
      }

      // 2. Pair with joyous victory chime flourish
      const victoryChimes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      victoryChimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(volume * 0.35, now + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.8);
      });
    } catch {}
  }

  playClick(volume: number = 0.3) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }
}

export const soundFX = new SoundFX();
