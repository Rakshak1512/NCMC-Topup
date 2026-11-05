import React from 'react';
import { Smartphone, Laptop, Radio, AlertCircle, ShieldAlert } from 'lucide-react';
import type { DeviceCapabilityReport } from '../utils/nfcDetector';

interface DeviceBadgeProps {
  report: DeviceCapabilityReport;
  showDetails?: boolean;
}

export const DeviceBadge: React.FC<DeviceBadgeProps> = ({ report, showDetails = false }) => {
  const getIcon = () => {
    switch (report.nfcState) {
      case 'supported':
        return <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />;
      case 'unsupported_ios':
        return <Smartphone className="w-3.5 h-3.5 text-amber-400" />;
      case 'unsupported_desktop':
        return <Laptop className="w-3.5 h-3.5 text-blue-400" />;
      case 'insecure_context':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getBadgeStyle = () => {
    switch (report.badgeColor) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getBadgeStyle()}`}
      >
        {getIcon()}
        <span>{report.badgeText}</span>
        <span className="opacity-60 text-[10px]">({report.browserName})</span>
      </span>

      {showDetails && (
        <span className="text-xs text-zinc-400 hidden sm:inline">
          {report.summaryDescription}
        </span>
      )}
    </div>
  );
};
