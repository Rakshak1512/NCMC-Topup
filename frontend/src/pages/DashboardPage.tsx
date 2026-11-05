import React from 'react';
import {
  Zap,
  History,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CardPreview } from '../components/CardPreview';
import { DeviceBadge } from '../components/DeviceBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    card,
    cards,
    selectCardById,
    transactions,
    resetCardData,
    deviceReport,
    setIsTopUpModalOpen,
    setIsAddCardModalOpen,
    setIsCardGuideOpen,
    setActivePage,
    setLastTransaction,
    setIsReceiptModalOpen,
  } = useApp();

  const balance = card?.balance ?? 450.0;
  const recentTxns = transactions.slice(0, 5);

  const handleOpenReceipt = (txn: any) => {
    setLastTransaction(txn);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Banner / Device Status & Quick Add Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              YatraTap NCMC Top-Up
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Active: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{card?.card_type || 'Bharat Yatra NCMC'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DeviceBadge report={deviceReport} />

          <button
            onClick={() => setIsCardGuideOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Where to Tap?</span>
          </button>

          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Graphic on left, Balance & Quick Top-Up on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Card Preview & Card Selector */}
        <div className="lg:col-span-5 space-y-4">
          <CardPreview
            card={card}
            cards={cards}
            onSelectCard={selectCardById}
            onReset={resetCardData}
            onQuickTopUp={() => setIsTopUpModalOpen(true)}
            onAddCard={() => setIsAddCardModalOpen(true)}
          />

          {/* Helper Card Placement Banner */}
          <div
            onClick={() => setIsCardGuideOpen(true)}
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                Wondering where to tap your physical card?
              </span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              View Guide →
            </span>
          </div>
        </div>

        {/* Right Column: Balance Stats & Quick Recharges & Recent Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                Demo Balance
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(balance)}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">In-Memory Ledger</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                Total Cards
              </span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
                {cards.length}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">Active in Session</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                Safe Environment
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Zero Bank Risk
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">Simulation Mode</span>
            </div>
          </div>

          {/* Quick Recharge Presets Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                Quick Simulated Top-Up
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">No real money required</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setIsTopUpModalOpen(true)}
                  className="py-2.5 px-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-mono text-xs font-bold transition-all text-center cursor-pointer shadow-sm active:scale-95"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Custom Amount Recharge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Activity List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-mono">
                  Recent Simulated Transactions
                </h3>
              </div>
              <button
                onClick={() => setActivePage('history')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
              >
                View All ({transactions.length}) →
              </button>
            </div>

            {recentTxns.length === 0 ? (
              <div className="py-6 text-center text-zinc-400 text-xs font-mono">
                No transactions recorded yet in this session.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {recentTxns.map((txn) => {
                  const isTopUp = txn.type === 'TOP_UP' || txn.type === 'INITIAL_LOAD';
                  return (
                    <div
                      key={txn.transaction_id}
                      onClick={() => handleOpenReceipt(txn)}
                      className="py-2.5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isTopUp
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {isTopUp ? '+' : '-'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                            {txn.label}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {formatDate(txn.timestamp)} • {txn.card_id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-mono font-bold ${
                            isTopUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {isTopUp ? '+' : '-'}{formatCurrency(txn.amount)}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Bal: {formatCurrency(txn.updated_balance)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
