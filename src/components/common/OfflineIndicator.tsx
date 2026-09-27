import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div
        className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8F5E9] dark:bg-[#1B5E20]/30 text-[#2E7D32] dark:text-[#66BB6A] border border-[#C8E6C9] dark:border-[#2E7D32]/50 ${className}`}
        title="Connected to network"
      >
        <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#66BB6A] animate-pulse" />
        <span>🟢 Online</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFEBEE] dark:bg-[#B71C1C]/30 text-[#D32F2F] dark:text-[#EF5350] border border-[#FFCDD2] dark:border-[#D32F2F]/50 shadow-sm animate-bounce ${className}`}
      title="Network connection lost"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>🔴 Offline — Game state preserved locally</span>
    </div>
  );
};
