import React from 'react';
import { soundFX } from '../../utils/soundUtils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  soundOnClick?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  soundOnClick = true,
  onClick,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundOnClick) {
      soundFX.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B1220] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]',
    xl: 'text-lg px-7 py-3.5 gap-3 min-h-[52px]',
  }[size];

  // Colors compliant with Light Theme (White & Blue) and Dark Theme
  const variantStyles = {
    // Primary Button: #1565C0, text white, hover #0D47A1
    primary:
      'bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-md shadow-blue-700/20 border border-[#1565C0] dark:bg-[#1976D2] dark:hover:bg-[#1565C0]',
    // Secondary Button: White background with blue border #1976D2 and text #1565C0
    secondary:
      'bg-white hover:bg-[#E3F2FD] text-[#1565C0] border-2 border-[#1976D2] shadow-sm dark:bg-[#111827] dark:hover:bg-[#172033] dark:text-[#64B5F6] dark:border-[#42A5F5]',
    // Gold/Highlight Button: Energetic call action
    gold:
      'bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-lg shadow-blue-800/25 border-2 border-[#64B5F6]',
    // Outline: Soft border
    outline:
      'bg-transparent border border-[#D6E4F0] dark:border-[#26354A] text-[#17324D] dark:text-[#F8FAFC] hover:bg-[#E3F2FD]/50 dark:hover:bg-[#172033]',
    // Ghost
    ghost:
      'bg-transparent hover:bg-[#E3F2FD] dark:hover:bg-[#172033] text-[#17324D] dark:text-[#F8FAFC]',
    // Danger: #D32F2F
    danger:
      'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-sm border border-[#D32F2F]',
    // Success: #2E7D32
    success:
      'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-sm border border-[#2E7D32]',
  }[variant];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
