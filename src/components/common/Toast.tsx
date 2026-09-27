import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  description?: string;
}

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const bgBorder = {
          success: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200',
          info: 'bg-indigo-950/90 border-indigo-500/60 text-indigo-200',
          warning: 'bg-amber-950/90 border-amber-500/60 text-amber-200',
          error: 'bg-rose-950/90 border-rose-500/60 text-rose-200',
        }[toast.type];

        const IconComponent = {
          success: CheckCircle2,
          info: Info,
          warning: AlertCircle,
          error: AlertCircle,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all ${bgBorder}`}
          >
            <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="font-semibold text-white">{toast.title}</div>
              {toast.description && (
                <div className="text-xs opacity-90 mt-0.5">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
