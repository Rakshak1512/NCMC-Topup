import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface NoticeBannerProps {
  compact?: boolean;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/20 px-3 py-1 rounded-lg flex items-center justify-center gap-2 text-xs text-emerald-800 dark:text-emerald-400 font-mono text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-emerald-50 dark:bg-zinc-950 border-b border-emerald-200 dark:border-emerald-500/20 px-4 py-2 text-center">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-900 dark:text-emerald-400 font-medium">
        <span className="flex items-center gap-1 bg-emerald-200/60 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          Simulation Environment
        </span>
        <span className="font-semibold tracking-wide">
          DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.
        </span>
      </div>
    </div>
  );
};
