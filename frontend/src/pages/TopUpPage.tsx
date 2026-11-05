import React, { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { TopUpPreviewResult } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export const TopUpPage: React.FC = () => {
  const { card, cards, selectCardById, performTopUp } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input');
  const [preview, setPreview] = useState<TopUpPreviewResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const currentBalance = card?.balance ?? 450.0;
  const activeAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  // Real-time preview query
  useEffect(() => {
    if (activeAmount <= 0) {
      setPreview(null);
      return;
    }

    let isMounted = true;
    setIsValidating(true);
    setErrorMessage(null);

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
            message: 'Calculation ready.',
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
  }, [activeAmount, currentBalance]);

  const handleSelectPreset = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    setCustomAmount('');
    setErrorMessage(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    const sanitized = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(sanitized);
    setErrorMessage(null);
  };

  const handleProceedToConfirm = () => {
    if (activeAmount <= 0) {
      setErrorMessage('Please select or enter an amount greater than ₹0.');
      return;
    }
    if (activeAmount > 10000) {
      setErrorMessage('Maximum single top-up in simulation is ₹10,000.');
      return;
    }
    setStep('confirm');
  };

  const handleExecute = async () => {
    setStep('processing');
    setTimeout(async () => {
      const res = await performTopUp(activeAmount);
      if (res) {
        setStep('input');
      } else {
        setStep('confirm');
        setErrorMessage('Simulation failed. Please check network connection.');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 py-6 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-bold">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Simulated Transit Top-Up Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          NCMC Demo Card Top-Up
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Simulate an on-chip transit balance recharge without actual money
        </p>
      </div>

      {/* Main Form Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md relative overflow-hidden">
        {/* Card Target Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 mb-5 font-mono text-xs">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Selected Card:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-zinc-900 dark:text-white font-bold">{card?.card_type || 'Bharat Yatra NCMC'}</span>
              <span className="text-zinc-400 text-[11px]">({card?.card_id})</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Current Balance:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
              {formatCurrency(currentBalance)}
            </span>
          </div>
        </div>

        {/* Card Switcher if multiple cards */}
        {cards.length > 1 && (
          <div className="mb-5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-zinc-500 text-[11px] shrink-0 font-medium">Switch:</span>
            {cards.map((c) => (
              <button
                key={c.card_id}
                onClick={() => selectCardById(c.card_id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 cursor-pointer ${
                  c.card_id === card?.card_id
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {c.card_type.slice(0, 14)}
              </button>
            ))}
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-5">
            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                Select Recharge Preset
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
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
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
                Or Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold text-lg">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border font-mono text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-all ${
                    isCustom
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
              </div>
            </div>

            {/* Preview Breakdown */}
            {activeAmount > 0 && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Current Balance:</span>
                  <span>{formatCurrency(currentBalance)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Top-Up Addition (+):</span>
                  <span>{formatCurrency(activeAmount)}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between text-sm font-bold text-zinc-900 dark:text-white">
                  <span>New Simulated Balance:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {preview ? formatCurrency(preview.projected_balance) : formatCurrency(currentBalance + activeAmount)}
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={handleProceedToConfirm}
              disabled={activeAmount <= 0 || isValidating}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
            >
              <span>Review Simulated Top-Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-emerald-500/30 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block">
                Total Top-Up Credit
              </span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono my-1.5 block">
                {formatCurrency(activeAmount)}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Credit to: {card?.card_id || 'NCMC-BY-8021-9943'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-mono border border-zinc-200 dark:border-zinc-700">
              <div className="flex justify-between">
                <span className="text-zinc-500">Current Balance:</span>
                <span>{formatCurrency(currentBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Credited Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{formatCurrency(activeAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white">
                <span>Resulting Balance:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(currentBalance + activeAmount)}</span>
              </div>
            </div>

            {/* Simulation Warning Disclaimer */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.</span>
            </div>

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
                onClick={handleExecute}
                className="flex-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 fill-zinc-950" />
                <span>Confirm Simulated Top-Up</span>
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">Simulating Card Top-Up...</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Generating simulated receipt & crediting transit balance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
