import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CardPreview } from '../components/CardPreview';
import { formatCurrency } from '../utils/formatters';

export const CardManagementPage: React.FC = () => {
  const { card, cards, selectCardById, resetCardData, setIsTopUpModalOpen, setIsAddCardModalOpen } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleConfirmReset = async () => {
    setIsResetting(true);
    await resetCardData();
    setIsResetting(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
              SIMULATED PROFILE
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Status: {card?.status || 'ACTIVE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
            NCMC Cards & Wallets
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Graphic & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Card Rendering */}
        <div className="lg:col-span-5 space-y-4">
          <CardPreview
            card={card}
            cards={cards}
            onSelectCard={selectCardById}
            onReset={() => setShowResetConfirm(true)}
            onQuickTopUp={() => setIsTopUpModalOpen(true)}
            onAddCard={() => setIsAddCardModalOpen(true)}
          />
        </div>

        {/* Right: Technical Metadata & Specifications */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">
              Card Attributes & Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Card Identifier</span>
                <span className="text-zinc-900 dark:text-white font-bold">{card?.card_id || 'NCMC-BY-8021-9943'}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Specification Standard</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{card?.standard || 'RuPay qSPARC v2'}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Issuing Partner</span>
                <span className="text-zinc-800 dark:text-zinc-200">{card?.issuer || 'State Bank of India / NPCI'}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Simulated Balance</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {formatCurrency(card?.balance ?? 450)}
                </span>
              </div>
            </div>
          </div>

          {/* Cards registered list */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase font-mono">
                Saved Cards in Session ({cards.length})
              </h4>
              <button
                onClick={() => setIsAddCardModalOpen(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                + Add Card
              </button>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {cards.map((c) => {
                const isActive = c.card_id === card?.card_id;
                return (
                  <div
                    key={c.card_id}
                    onClick={() => selectCardById(c.card_id)}
                    className={`py-3 px-2 flex items-center justify-between rounded-xl cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/20'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span>{c.card_type}</span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-zinc-950 font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {c.card_id} • {c.card_number_masked}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(c.balance)}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {isActive ? 'Current' : 'Click to select'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Reset Demo Cards?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                This will reset the demo card balance to ₹450.00 and restore initial transaction logs.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
