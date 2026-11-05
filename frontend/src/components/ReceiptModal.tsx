import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight, Printer, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, truncateHash } from '../utils/formatters';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, lastTransaction, setActivePage } = useApp();

  if (!isReceiptModalOpen || !lastTransaction) return null;

  const handleGoToHistory = () => {
    setIsReceiptModalOpen(false);
    setActivePage('history');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl text-zinc-900 dark:text-white overflow-hidden print:border-none print:shadow-none"
      >
        <button
          onClick={() => setIsReceiptModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status */}
        <div className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-bold">
            SIMULATED TOP-UP SUCCESS
          </span>
          <h3 className="text-2xl font-black font-mono text-zinc-900 dark:text-white mt-1.5">
            +{formatCurrency(lastTransaction.amount)}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Card: {lastTransaction.card_id}
          </p>
        </div>

        {/* Receipt Details Table */}
        <div className="py-4 space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Transaction ID</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{lastTransaction.transaction_id}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Timestamp</span>
            <span>{formatDate(lastTransaction.timestamp)}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Previous Balance</span>
            <span>{formatCurrency(lastTransaction.previous_balance)}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Credited Amount</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{formatCurrency(lastTransaction.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Updated Balance</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              {formatCurrency(lastTransaction.updated_balance)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-900">
            <span className="text-zinc-500">Simulated Receipt Hash</span>
            <span className="text-[10px] text-zinc-400">
              {truncateHash(lastTransaction.receipt_hash, 16)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-500">Channel</span>
            <span>{lastTransaction.payment_method}</span>
          </div>
        </div>

        {/* Mandatory Demo Disclaimer */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-mono leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            title="Print simulated receipt"
            className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleGoToHistory}
            className="flex-1 py-3 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
