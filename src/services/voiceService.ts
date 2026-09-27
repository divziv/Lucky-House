import { GameConfig, NumberRange, VoiceSettings } from '../types/tambola';
import { getNumberAnnouncement } from '../utils/numberCallPhrases';

export class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private settings: VoiceSettings = {
    enabled: true,
    voiceURI: '',
    rate: 0.95,
    pitch: 1.0,
    volume: 1.0,
    callingStyle: 'familyFriendly',
    includeNicknames: true,
  };
  private isSupported: boolean = false;
  private voicesCache: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.voicesCache = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        if (this.synth) {
          this.voicesCache = this.synth.getVoices();
        }
      };
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (this.voicesCache.length === 0) {
      this.voicesCache = this.synth.getVoices();
    }
    return this.voicesCache;
  }

  public updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public isSpeechSupported(): boolean {
    return this.isSupported;
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public speakText(text: string, onEnd?: () => void) {
    if (!this.synth || !this.settings.enabled) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      const voices = this.getAvailableVoices();
      if (this.settings.voiceURI) {
        const found = voices.find((v) => v.voiceURI === this.settings.voiceURI);
        if (found) utterance.voice = found;
      } else {
        const naturalEn = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
        );
        if (naturalEn) utterance.voice = naturalEn;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      this.synth.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public speakNumber(num: number, numberRange: NumberRange = { start: 1, end: 90 }, onEnd?: () => void) {
    if (!this.settings.enabled || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    const announcement = getNumberAnnouncement(num, numberRange, this.settings.callingStyle);
    const combinedSpeech = announcement.spokenPhrases.join('. ');
    this.speakText(combinedSpeech, onEnd);
  }

  public speakRules(config: GameConfig, onEnd?: () => void) {
    if (!this.settings.enabled || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    const sentences: string[] = [
      'Welcome to our Lucky House Tambola.',
      `The game is being played with numbers from ${config.numberRange.start} to ${config.numberRange.end}.`,
    ];

    if (config.prizes.fastFive > 0) {
      sentences.push('Fast Five has one winner.');
    }
    if (config.prizes.firstLine > 0) {
      sentences.push(`First Line has ${config.prizes.firstLine} ${config.prizes.firstLine === 1 ? 'winner' : 'winners'}.`);
    }
    if (config.prizes.secondLine > 0) {
      sentences.push(`Second Line has ${config.prizes.secondLine} ${config.prizes.secondLine === 1 ? 'winner' : 'winners'}.`);
    }
    if (config.prizes.thirdLine > 0) {
      sentences.push(`Third Line has ${config.prizes.thirdLine} ${config.prizes.thirdLine === 1 ? 'winner' : 'winners'}.`);
    }
    if (config.prizes.fullHouse > 0) {
      sentences.push(`Full House has ${config.prizes.fullHouse} ${config.prizes.fullHouse === 1 ? 'winner' : 'winners'}.`);
    }
    if (config.prizes.lastFive > 0) {
      sentences.push(`Last Five has ${config.prizes.lastFive} ${config.prizes.lastFive === 1 ? 'winner' : 'winners'}.`);
    }

    if (config.lineWinnerFullHouseEligibility) {
      sentences.push('Players who have already won a line may continue for Full House.');
    } else {
      sentences.push('Players who have won a line prize cannot claim Full House.');
    }

    sentences.push('Note that a player who wins one line cannot claim another line on the same card.');
    sentences.push('After five numbers are called, the game will pause so players can check their cards.');
    sentences.push('Good luck, and enjoy the game!');

    this.speakText(sentences.join(' '), onEnd);
  }
}

export const voiceService = new VoiceService();
