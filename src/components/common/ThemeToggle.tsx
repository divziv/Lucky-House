import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showDropdown = true }) => {
  const { mode, theme, toggleTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => (showDropdown ? setIsOpen(!isOpen) : toggleTheme())}
        title={`Theme: ${mode} (${theme})`}
        aria-label={`Theme: ${mode}`}
        className="px-2.5 py-1.5 rounded-xl border border-[#D6E4F0] dark:border-[#26354A] bg-white dark:bg-[#111827] text-[#17324D] dark:text-[#F8FAFC] hover:bg-[#E3F2FD] dark:hover:bg-[#172033] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-[#64B5F6] transition-transform hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-[#F9A825] transition-transform hover:rotate-45" />
        )}
        <span className="capitalize">{mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}</span>
        {showDropdown && <ChevronDown className="w-3 h-3 text-[#607D8B] dark:text-[#B0BEC5]" />}
      </button>

      {/* Theme Options Dropdown */}
      {showDropdown && isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#111827] border border-[#D6E4F0] dark:border-[#26354A] shadow-xl py-1.5 z-50 text-xs text-[#17324D] dark:text-[#F8FAFC] animate-call-pop">
          <button
            type="button"
            onClick={() => handleSelectMode('light')}
            className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#E3F2FD] dark:hover:bg-[#172033] cursor-pointer ${
              mode === 'light' ? 'font-bold text-[#1565C0] bg-[#E3F2FD]/50 dark:text-[#64B5F6]' : ''
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#F9A825]" />
            <span>Light</span>
            {mode === 'light' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('dark')}
            className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#E3F2FD] dark:hover:bg-[#172033] cursor-pointer ${
              mode === 'dark' ? 'font-bold text-[#1565C0] bg-[#E3F2FD]/50 dark:text-[#64B5F6]' : ''
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#64B5F6]" />
            <span>Dark</span>
            {mode === 'dark' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('system')}
            className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#E3F2FD] dark:hover:bg-[#172033] cursor-pointer ${
              mode === 'system' ? 'font-bold text-[#1565C0] bg-[#E3F2FD]/50 dark:text-[#64B5F6]' : ''
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#607D8B]" />
            <span>System</span>
            {mode === 'system' && <span className="ml-auto text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};
