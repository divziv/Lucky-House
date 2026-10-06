import React from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Sparkles, Check, Sun, Moon, Laptop, Palette } from 'lucide-react';

export interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { mode, theme, setThemeMode } = useTheme();

  const themes: {
    id: ThemeMode;
    title: string;
    subtitle: string;
    tag: string;
    bgHex: string;
    cardHex: string;
    borderHex: string;
    primaryHex: string;
    accentHex: string;
    textColor: string;
    icon: string;
  }[] = [
    {
      id: 'black-gold',
      title: 'Royal Black & Gold',
      subtitle: 'Festive, premium dark theme for game nights with gold highlights',
      tag: 'Dark Theme',
      bgHex: '#0B0B0B',
      cardHex: '#171717',
      borderHex: '#D4AF37',
      primaryHex: '#D4AF37',
      accentHex: '#FFD54F',
      textColor: '#FFFFFF',
      icon: '🖤',
    },
    {
      id: 'white-blue',
      title: 'White & Blue',
      subtitle: 'Clean, crisp professional light theme with vibrant blue accents',
      tag: 'Default Light',
      bgHex: '#F5FAFF',
      cardHex: '#FFFFFF',
      borderHex: '#1565C0',
      primaryHex: '#1565C0',
      accentHex: '#1976D2',
      textColor: '#17324D',
      icon: '🤍',
    },
    {
      id: 'white-pink',
      title: 'White & Pink',
      subtitle: 'Cheerful, friendly universal alternative with vibrant pink accents',
      tag: 'Warm & Friendly',
      bgHex: '#FFF7FA',
      cardHex: '#FFFFFF',
      borderHex: '#D81B60',
      primaryHex: '#D81B60',
      accentHex: '#EC407A',
      textColor: '#3E2731',
      icon: '🤍',
    },
    {
      id: 'system',
      title: 'System / Automatic',
      subtitle: 'Automatically matches your device system appearance setting',
      tag: 'Adaptive',
      bgHex: '#1E293B',
      cardHex: '#0F172A',
      borderHex: '#64748B',
      primaryHex: '#38BDF8',
      accentHex: '#818CF8',
      textColor: '#F8FAFC',
      icon: '💻',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appearance"
      subtitle="Select your preferred visual theme for the board and game display"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themes.map((t) => {
            const isSelected = mode === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeMode(t.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-amber-500/60 shadow-lg scale-[1.01]'
                    : 'hover:border-slate-400/50 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: t.bgHex,
                  borderColor: isSelected ? t.primaryHex : `${t.borderHex}55`,
                  color: t.textColor,
                }}
              >
                {/* Visual Preview Box */}
                <div
                  className="rounded-xl p-3 mb-3 border flex flex-col justify-between min-h-[90px] shadow-sm relative"
                  style={{
                    backgroundColor: t.cardHex,
                    borderColor: `${t.borderHex}44`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                      <span>{t.icon}</span>
                      <span>{t.id === 'black-gold' ? 'BLACK & GOLD' : t.id === 'white-blue' ? 'WHITE & BLUE' : t.id === 'white-pink' ? 'WHITE & PINK' : 'SYSTEM AUTO'}</span>
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${t.primaryHex}25`,
                        color: t.accentHex,
                      }}
                    >
                      {t.tag}
                    </span>
                  </div>

                  {/* Sample Current Number mini-preview */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono-nums font-black text-sm shadow-xs"
                        style={{
                          backgroundColor: t.primaryHex,
                          color: t.id === 'black-gold' ? '#0B0B0B' : '#FFFFFF',
                        }}
                      >
                        77
                      </div>
                      <span className="text-[11px] font-semibold opacity-80 truncate max-w-[110px]">
                        Hum Saath Saath Hai
                      </span>
                    </div>

                    {/* Swatches */}
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: t.accentHex }}
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Title & Description */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                      <span>{t.title}</span>
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5 leading-snug">
                      {t.subtitle}
                    </p>
                  </div>

                  {/* Selection Radio / Check Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'border-current' : 'border-slate-500/50'
                    }`}
                  >
                    {isSelected && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-500">
          <span>Active theme: <strong className="text-slate-700 dark:text-slate-300 capitalize">{theme.replace('-', ' ')}</strong></span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
