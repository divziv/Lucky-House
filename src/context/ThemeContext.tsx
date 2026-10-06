import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme, ThemeMode } from '../types/tambola';

export type { AppTheme, ThemeMode };

interface ThemeContextType {
  mode: ThemeMode;
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tambola_masti_theme_v2';
const LEGACY_STORAGE_KEY = 'tambola_masti_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'black-gold' || saved === 'white-blue' || saved === 'white-pink' || saved === 'system') {
        return saved;
      }
      // Check legacy key
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy === 'dark') return 'black-gold';
      if (legacy === 'light') return 'white-blue';
      if (legacy === 'system') return 'system';
    }
    // Default is explicitly White & Blue theme
    return 'white-blue';
  });

  const [activeTheme, setActiveTheme] = useState<AppTheme>('white-blue');

  // Resolve active theme based on mode & system preference
  useEffect(() => {
    const resolveTheme = (): AppTheme => {
      if (mode === 'system') {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'black-gold';
        }
        return 'white-blue';
      }
      return mode;
    };

    const resolved = resolveTheme();
    setActiveTheme(resolved);

    const root = document.documentElement;
    // Remove previous theme classes
    root.classList.remove('theme-black-gold', 'theme-white-blue', 'theme-white-pink', 'dark', 'light');

    // Add current theme class
    root.classList.add(`theme-${resolved}`);
    if (resolved === 'black-gold') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem(THEME_STORAGE_KEY, mode);
    localStorage.setItem(LEGACY_STORAGE_KEY, resolved === 'black-gold' ? 'dark' : 'light');

    // If system mode, listen for OS preference changes
    if (mode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        const newTheme: AppTheme = e.matches ? 'black-gold' : 'white-blue';
        setActiveTheme(newTheme);
        root.classList.remove('theme-black-gold', 'theme-white-blue', 'theme-white-pink', 'dark', 'light');
        root.classList.add(`theme-${newTheme}`);
        if (newTheme === 'black-gold') {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [mode]);

  const toggleTheme = () => {
    setModeState((prev) => {
      if (prev === 'white-blue') return 'black-gold';
      if (prev === 'black-gold') return 'white-pink';
      return 'white-blue';
    });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const isDark = activeTheme === 'black-gold';

  return (
    <ThemeContext.Provider value={{ mode, theme: activeTheme, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
