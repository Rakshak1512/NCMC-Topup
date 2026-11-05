import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Smartphone, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export type ScanStatus = 'idle' | 'scanning' | 'detected' | 'unsupported' | 'cancelled' | 'failed';

interface NfcRadarAnimationProps {
  status: ScanStatus;
  statusMessage?: string;
  onSimulateTap?: () => void;
}

export const NfcRadarAnimation: React.FC<NfcRadarAnimationProps> = ({
  status,
  statusMessage,
  onSimulateTap,
}) => {
  const getRingColor = () => {
    switch (status) {
      case 'scanning':
        return 'border-emerald-500/40 bg-emerald-500/5';
      case 'detected':
        return 'border-emerald-400 bg-emerald-500/20';
      case 'unsupported':
      case 'cancelled':
        return 'border-amber-500/40 bg-amber-500/5';
      case 'failed':
        return 'border-rose-500/40 bg-rose-500/5';
      default:
        return 'border-zinc-700/50 bg-zinc-800/10';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8 overflow-hidden select-none">
      {/* Concentric Radar Rings */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer Ring 3 */}
        <motion.div
          animate={
            status === 'scanning'
              ? { scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }
              : { scale: 1, opacity: 0.2 }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute w-full h-full rounded-full border-2 border-dashed ${getRingColor()}`}
        />

        {/* Middle Ring 2 */}
        <motion.div
          animate={
            status === 'scanning'
              ? { scale: [1, 1.15, 1], opacity: [0.4, 0.85, 0.4] }
              : { scale: 1, opacity: 0.3 }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className={`absolute w-56 h-56 rounded-full border ${getRingColor()}`}
        />

        {/* Inner Ring 1 */}
        <div className={`absolute w-40 h-40 rounded-full border ${getRingColor()}`} />

        {/* Rotating Radar Sweep Line when Scanning */}
        {status === 'scanning' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-emerald-400 origin-left transform -translate-x-1/2 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </motion.div>
        )}

        {/* Central Device/Card Holographic Display */}
        <div className="relative z-10 w-24 h-24 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-3 text-center backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {status === 'scanning' && (
              <motion.div
                key="scanning-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-emerald-400"
              >
                <Radio className="w-8 h-8 animate-pulse text-emerald-400" />
                <span className="text-[10px] font-mono tracking-wider font-semibold">POLLING</span>
              </motion.div>
            )}

            {status === 'detected' && (
              <motion.div
                key="detected-icon"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-emerald-400"
              >
                <CheckCircle2 className="w-9 h-9 text-emerald-400 fill-emerald-400/20" />
                <span className="text-[10px] font-mono tracking-wider font-bold">DETECTED</span>
              </motion.div>
            )}

            {status === 'unsupported' && (
              <motion.div
                key="unsupported-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-amber-400"
              >
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[9px] font-mono tracking-wider">RESTRICTED</span>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                key="failed-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-rose-400"
              >
                <XCircle className="w-8 h-8" />
                <span className="text-[10px] font-mono tracking-wider">ERROR</span>
              </motion.div>
            )}

            {status === 'idle' && (
              <motion.div
                key="idle-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-zinc-400"
              >
                <Smartphone className="w-8 h-8 text-zinc-400" />
                <span className="text-[10px] font-mono tracking-wider">READY</span>
              </motion.div>
            )}

            {status === 'cancelled' && (
              <motion.div
                key="cancelled-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-zinc-400"
              >
                <XCircle className="w-8 h-8 text-zinc-400" />
                <span className="text-[10px] font-mono tracking-wider">STOPPED</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status Description Text */}
      <div className="mt-4 text-center max-w-sm">
        <p className="text-sm font-semibold text-zinc-200">
          {statusMessage || 'Hold your Bharat Yatra NCMC card against the back of your phone'}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {status === 'scanning'
            ? 'Waiting for NFC radio wave coupling (13.56 MHz)...'
            : 'Standard Web NFC reads tag UID. On-chip transit balances are simulated.'}
        </p>
      </div>

      {/* Simulated Tap Action Fallback Pill */}
      {onSimulateTap && (
        <div className="mt-6">
          <button
            onClick={onSimulateTap}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Simulate Instant NFC Card Tap
          </button>
        </div>
      )}
    </div>
  );
};

