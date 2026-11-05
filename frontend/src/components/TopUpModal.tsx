import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { api } from '../services/api';
import type { TopUpPreviewResult } from '../services/api';

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export const TopUpModal: React.FC = () => {
  const { isTopUpModalOpen, setIsTopUpModalOpen, card, performTopUp } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input');
  const [preview, setPreview] = useState<TopUpPreviewResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const currentBalance = card?.balance ?? 450.0;
  const activeAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  useEffect(() => {
    if (!isTopUpModalOpen) {
      setStep('input');
      setErrorMsg(null);
      return;
    }

    if (activeAmount <= 0) {
      setPreview(null);
      return;
    }

    let isMounted = true;
    setIsValidating(true);
    setErrorMsg(null);

    const timer = setTimeout(async () => {
      try {
        const res = await api.previewTopUp(activeAmount);
        if (isMounted) setPreview(res);
      } catch {
        if (isMounted) {
          setPreview({
            amount: activeAmount,
            current_balance: currentBalance,
            projected_balance: currentBalance + activeAmount,
            currency: 'INR',
            convenience_fee: 0,
            total_payable: activeAmount,
            is_valid: true,
            message: 'Local calculation preview.',
            disclaimer: 'DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.',
          });
        }
      } finally {
        if (isMounted) setIsValidating(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeAmount, isTopUpModalOpen, currentBalance]);

  if (!isTopUpModalOpen) return null;

  const handleSelectPreset = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    setCustomAmount('');
    setErrorMsg(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setErrorMsg(null);
  };

  const handleProceedToConfirm = () => {
    if (activeAmount <= 0) {
      setErrorMsg('Please select or enter an amount greater than ₹0.');
      return;
    }
    if (activeAmount > 10000) {
      setErrorMsg('Maximum single top-up in simulation is ₹10,000.');
      return;
    }
    setStep('confirm');
  };

  const handleExecuteTopUp = async () => {
    setStep('processing');
    setTimeout(async () => {
      const result = await performTopUp(activeAmount);
      if (result) {
        setIsTopUpModalOpen(false);
        setStep('input');
      } else {
        setStep('confirm');
        setErrorMsg('Simulated top-up transaction failed. Please retry.');
      }
    }, 1200);
  };

  const handleClose = () => {
    if (step === 'processing') return;
    setIsTopUpModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl text-zinc-900 dark:text-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Simulated NCMC Top-Up
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {card?.card_id || 'NCMC-BY-8021-9943'} ({card?.card_type})
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content based on Step */}
        <div className="mt-5 space-y-4">
          {step === 'input' && (
            <>
              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Select Preset Recharge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = !isCustom && selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`py-3 px-3 rounded-xl font-mono font-bold text-sm transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Or Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-semibold text-lg">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border font-mono text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-all ${
                      isCustom
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
              </div>

              {/* Calculation Preview Box */}
              {activeAmount > 0 && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Current Simulated Balance:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(currentBalance)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Recharge Addition (+):</span>
                    <span className="font-semibold">{formatCurrency(activeAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm font-bold text-zinc-900 dark:text-white">
                    <span>Projected Balance:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {preview ? formatCurrency(preview.projected_balance) : formatCurrency(currentBalance + activeAmount)}
                    </span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleProceedToConfirm}
                disabled={activeAmount <= 0 || isValidating}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Continue to Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-emerald-500/30 text-center">
                <span className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block font-mono">
                  Total Demo Top-Up Amount
                </span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono my-1 block">
                  {formatCurrency(activeAmount)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Target: {card?.card_type} ({card?.card_number_masked})
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex justify-between py-1.5 border-b border-zinc-200 dark:border-zinc-800 font-mono">
                  <span className="text-zinc-500">Current Balance:</span>
                  <span>{formatCurrency(currentBalance)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-200 dark:border-zinc-800 font-mono">
                  <span className="text-zinc-500">Updated Balance:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatCurrency(currentBalance + activeAmount)}
                  </span>
                </div>
              </div>

              {/* Warning Disclaimer Box */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTopUp}
                  className="flex-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 fill-zinc-950" />
                  <span>Confirm Simulated Top-Up</span>
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Simulating Card Top-Up...</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                  Updating in-memory transit balance
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
