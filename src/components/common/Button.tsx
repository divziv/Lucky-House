import React from 'react';
import { soundFX } from '../../utils/soundUtils';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundOnClick) {
      soundFX.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const isBlackGold = theme === 'black-gold';
  const isWhitePink = theme === 'white-pink';

  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]',
    xl: 'text-lg px-7 py-3.5 gap-3 min-h-[52px]',
  }[size];

  let variantStyles = '';

  if (variant === 'primary') {
    if (isBlackGold) {
      variantStyles = 'bg-[#D4AF37] hover:bg-[#FFD54F] text-[#0B0B0B] font-bold shadow-md shadow-amber-500/20 border border-[#FFD54F]';
    } else if (isWhitePink) {
      variantStyles = 'bg-[#D81B60] hover:bg-[#AD1457] text-white shadow-md shadow-pink-700/20 border border-[#D81B60]';
    } else {
      variantStyles = 'bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-md shadow-blue-700/20 border border-[#1565C0]';
    }
  } else if (variant === 'secondary') {
    if (isBlackGold) {
      variantStyles = 'bg-[#171717] hover:bg-[#222222] text-[#FFD54F] border-2 border-[#D4AF37] shadow-xs';
    } else if (isWhitePink) {
      variantStyles = 'bg-white hover:bg-[#FCE4EC] text-[#D81B60] border-2 border-[#EC407A] shadow-xs';
    } else {
      variantStyles = 'bg-white hover:bg-[#E3F2FD] text-[#1565C0] border-2 border-[#1976D2] shadow-xs';
    }
  } else if (variant === 'gold') {
    if (isBlackGold) {
      variantStyles = 'bg-[#FFD54F] hover:bg-[#FFC107] text-[#0B0B0B] font-black shadow-lg shadow-amber-400/30 border-2 border-[#D4AF37]';
    } else if (isWhitePink) {
      variantStyles = 'bg-[#D81B60] hover:bg-[#AD1457] text-white font-bold shadow-lg shadow-pink-700/30 border-2 border-[#EC407A]';
    } else {
      variantStyles = 'bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold shadow-lg shadow-blue-800/25 border-2 border-[#64B5F6]';
    }
  } else if (variant === 'outline') {
    if (isBlackGold) {
      variantStyles = 'bg-transparent border border-[#4A3A12] text-white hover:bg-[#171717]';
    } else if (isWhitePink) {
      variantStyles = 'bg-transparent border border-[#F3D5DF] text-[#3E2731] hover:bg-[#FCE4EC]';
    } else {
      variantStyles = 'bg-transparent border border-[#D6E4F0] text-[#17324D] hover:bg-[#E3F2FD]/50';
    }
  } else if (variant === 'ghost') {
    if (isBlackGold) {
      variantStyles = 'bg-transparent hover:bg-[#171717] text-white';
    } else if (isWhitePink) {
      variantStyles = 'bg-transparent hover:bg-[#FCE4EC] text-[#3E2731]';
    } else {
      variantStyles = 'bg-transparent hover:bg-[#E3F2FD] text-[#17324D]';
    }
  } else if (variant === 'danger') {
    variantStyles = 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-xs border border-[#D32F2F]';
  } else if (variant === 'success') {
    variantStyles = 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-xs border border-[#2E7D32]';
  }

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
