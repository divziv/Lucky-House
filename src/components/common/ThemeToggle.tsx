import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { Sun, Moon, Laptop, ChevronDown, Palette, Heart } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showDropdown = true }) => {
  const { mode, theme, toggleTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectMode = (m: ThemeMode) => {
    setThemeMode(m);
    setIsOpen(false);
  };

  const getThemeLabel = () => {
    if (mode === 'system') return 'System';
    if (mode === 'black-gold') return 'Black & Gold';
    if (mode === 'white-pink') return 'White & Pink';
    return 'White & Blue';
  };

  const getThemeIcon = () => {
    if (theme === 'black-gold') {
      return <span className="text-amber-400">🖤</span>;
    }
    if (theme === 'white-pink') {
      return <span className="text-pink-500">🤍</span>;
    }
    return <span className="text-blue-600">🤍</span>;
  };

  return (
    <>
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => (showDropdown ? setIsOpen(!isOpen) : toggleTheme())}
          title={`Appearance: ${getThemeLabel()}`}
          aria-label={`Appearance: ${getThemeLabel()}`}
          className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-amber-900/60 bg-white dark:bg-[#171717] text-slate-800 dark:text-amber-100 hover:bg-slate-100 dark:hover:bg-[#222222] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
        >
          {getThemeIcon()}
          <span className="capitalize">{getThemeLabel()}</span>
          {showDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
        </button>

        {/* Theme Options Dropdown */}
        {showDropdown && isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#171717] border border-slate-200 dark:border-amber-900/50 shadow-xl py-1.5 z-50 text-xs text-slate-800 dark:text-slate-100 animate-call-pop">
            <button
              type="button"
              onClick={() => handleSelectMode('black-gold')}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-amber-500/10 cursor-pointer ${
                mode === 'black-gold' ? 'font-bold text-amber-500 bg-amber-500/10' : ''
              }`}
            >
              <span>🖤</span>
              <span>Black &amp; Gold</span>
              {mode === 'black-gold' && <span className="ml-auto text-xs text-amber-400">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('white-blue')}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer ${
                mode === 'white-blue' ? 'font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40' : ''
              }`}
            >
              <span>🤍</span>
              <span>White &amp; Blue</span>
              {mode === 'white-blue' && <span className="ml-auto text-xs text-blue-600">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('white-pink')}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-pink-50 dark:hover:bg-pink-950/30 cursor-pointer ${
                mode === 'white-pink' ? 'font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/40' : ''
              }`}
            >
              <span>🤍</span>
              <span>White &amp; Pink</span>
              {mode === 'white-pink' && <span className="ml-auto text-xs text-pink-500">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('system')}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                mode === 'system' ? 'font-bold text-slate-700 bg-slate-100 dark:bg-slate-800' : ''
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>System / Automatic</span>
              {mode === 'system' && <span className="ml-auto text-xs">✓</span>}
            </button>

            <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowModal(true);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/10 cursor-pointer"
              >
                <Palette className="w-3 h-3" />
                <span>Theme Previews...</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ThemeSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

