import React, { useEffect, useState } from 'react';
import { VoiceSettings, SoundSettings, CallingStyle } from '../../types/tambola';
import { voiceService } from '../../services/voiceService';
import { soundFX } from '../../utils/soundUtils';
import { Button } from '../common/Button';
import { Volume2, VolumeX, Mic, Play, Bell, Sparkles } from 'lucide-react';

export interface VoiceSettingsProps {
  voiceSettings: VoiceSettings;
  soundSettings: SoundSettings;
  onVoiceChange: (settings: VoiceSettings) => void;
  onSoundChange: (settings: SoundSettings) => void;
}

export const VoiceSettingsComponent: React.FC<VoiceSettingsProps> = ({
  voiceSettings,
  soundSettings,
  onVoiceChange,
  onSoundChange,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = voiceService.isSpeechSupported();

  useEffect(() => {
    const updateVoices = () => {
      const v = voiceService.getAvailableVoices();
      setVoices(v);
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTestSpeech = () => {
    soundFX.playCallChime();
    setTimeout(() => {
      voiceService.updateSettings(voiceSettings);
      // Test calling 7 with family-friendly style
      voiceService.speakNumber(7, { start: 1, end: 90 });
    }, 200);
  };

  const callingStyles: { id: CallingStyle; title: string; subtitle: string }[] = [
    {
      id: 'simple',
      title: 'Simple',
      subtitle: 'Only speaks number & digit breakdown (e.g. "Twenty-two. Double digit, two two, twenty-two.")',
    },
    {
      id: 'familyFriendly',
      title: 'Family Friendly',
      subtitle: 'Safe, wholesome cultural & milestone descriptions (e.g. "Lucky number seven", "Silver Jubilee")',
    },
    {
      id: 'fun',
      title: 'Fun',
      subtitle: 'Enthusiastic playful phrases with extra energy for parties and family game nights',
    },
    {
      id: 'classic',
      title: 'Classic',
      subtitle: 'Balanced classic announcements with traditional number references',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-heading">Voice & Audio Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure number caller speech synthesis, family-friendly calling styles, and sound effects.
        </p>
      </div>

      {!isSupported && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs">
          Speech synthesis is not supported in this browser. Visual boards and sound effects will remain fully functional.
        </div>
      )}

      {/* Voice Announcement Master Toggle */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {voiceSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Voice Number Caller</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Announce called numbers & rules aloud using browser Web Speech API
            </div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={voiceSettings.enabled}
            onChange={(e) => onVoiceChange({ ...voiceSettings, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {voiceSettings.enabled && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          {/* Calling Style Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Calling Style (Child & Family Friendly)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {callingStyles.map((style) => {
                const isSelected = voiceSettings.callingStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => onVoiceChange({ ...voiceSettings, callingStyle: style.id })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      onVoiceChange({ ...voiceSettings, callingStyle: style.id })
                    }
                    className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{style.title}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{style.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              Caller Voice
            </label>
            <select
              value={voiceSettings.voiceURI}
              onChange={(e) => onVoiceChange({ ...voiceSettings, voiceURI: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="">Default System Voice</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed & Pitch Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Speech Rate</span>
                <span className="font-mono-nums text-amber-400">{voiceSettings.rate}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={voiceSettings.rate}
                onChange={(e) =>
                  onVoiceChange({ ...voiceSettings, rate: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Pitch</span>
                <span className="font-mono-nums text-amber-400">{voiceSettings.pitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={voiceSettings.pitch}
                onChange={(e) =>
                  onVoiceChange({ ...voiceSettings, pitch: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Test Voice Button */}
          <div className="pt-2">
            <Button variant="secondary" size="sm" onClick={handleTestSpeech}>
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Voice Announcement
            </Button>
          </div>
        </div>
      )}

      {/* Synthesized UI Sound Effects */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Synthesized Sound FX</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Chimes for number draws, pauses, and win celebrations
            </div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={soundSettings.enabled}
            onChange={(e) => onSoundChange({ ...soundSettings, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>
    </div>
  );
};
