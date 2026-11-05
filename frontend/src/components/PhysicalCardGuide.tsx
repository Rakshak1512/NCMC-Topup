import React from 'react';
import { Smartphone, Radio, CheckCircle2, X } from 'lucide-react';

interface PhysicalCardGuideProps {
  onClose?: () => void;
  inline?: boolean;
}

export const PhysicalCardGuide: React.FC<PhysicalCardGuideProps> = ({ onClose, inline = false }) => {
  const content = (
    <div className="space-y-4 text-xs font-sans">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
            Where to Tap Your Physical NCMC Card
          </h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            NFC antennas are located in specific zones depending on device model
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Android Placement */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              Android Phones
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              Top / Center Rear
            </span>
          </div>
          <div className="relative aspect-[3/2] w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center p-2 overflow-hidden border border-zinc-300 dark:border-zinc-700">
            {/* Simple graphic of phone back with sweet spot */}
            <div className="relative w-28 h-20 bg-zinc-300 dark:bg-zinc-900 rounded-lg border-2 border-zinc-400 dark:border-zinc-600 flex flex-col items-center justify-start p-1.5">
              <div className="w-6 h-3 bg-zinc-500 dark:bg-zinc-700 rounded-sm mb-1"></div>
              {/* Pulsing target hotspot */}
              <div className="w-12 h-8 rounded-md bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300 animate-pulse text-center">
                TAP HERE
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight">
            Hold card flat against the <strong>upper-middle back</strong> near the camera module. Hold steady for 1-2 seconds.
          </p>
        </div>

        {/* iPhone Placement */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-xs">
              <Smartphone className="w-4 h-4 text-amber-500" />
              Apple iPhone
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
              Top Edge
            </span>
          </div>
          <div className="relative aspect-[3/2] w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center p-2 overflow-hidden border border-zinc-300 dark:border-zinc-700">
            <div className="relative w-28 h-20 bg-zinc-300 dark:bg-zinc-900 rounded-lg border-2 border-zinc-400 dark:border-zinc-600 flex flex-col items-center justify-start">
              {/* Top rim hotspot */}
              <div className="w-full h-4 bg-amber-500/40 border-b border-amber-500 flex items-center justify-center text-[8px] font-mono font-bold text-amber-800 dark:text-amber-200 animate-pulse">
                TOP EDGE NFC
              </div>
              <div className="w-6 h-1.5 bg-zinc-500 dark:bg-zinc-700 rounded-full mt-1"></div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight">
            The NFC antenna is along the <strong>top rim</strong>. Rest the card against the top edge or back of camera notch.
          </p>
        </div>
      </div>

      {/* Pro-Tips List */}
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1">
        <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tips for Instant Card Detection:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400 pl-1">
          <li>Remove thick magnetic, leather, or metallic phone cases.</li>
          <li>Hold card completely still for 2 full seconds until phone vibrates.</li>
          <li>Ensure device NFC is switched ON in system Quick Settings.</li>
          <li>On Desktop & iPhone browsers (where Web NFC is disabled by browser), use the <strong>Instant Virtual Tap</strong> button.</li>
        </ul>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
};
