import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = 'md',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidthStyles} my-8 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 rounded-2xl shadow-2xl shadow-black/60 p-6 z-10 transition-colors`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-heading">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
