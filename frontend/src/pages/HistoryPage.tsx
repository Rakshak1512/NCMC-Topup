import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const HistoryPage: React.FC = () => {
  const {
    transactions,
    clearLocalHistory,
    setLastTransaction,
    setIsReceiptModalOpen,
    setIsTopUpModalOpen,
  } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TOP_UP' | 'DEBIT'>('ALL');

  const filteredTxns = transactions.filter((txn) => {
    const matchesSearch =
      txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.card_id.toLowerCase().includes(searchTerm.toLowerCase());

    if (typeFilter === 'TOP_UP') {
      return matchesSearch && (txn.type === 'TOP_UP' || txn.type === 'INITIAL_LOAD');
    }
    if (typeFilter === 'DEBIT') {
      return matchesSearch && txn.type === 'TRANSIT_DEBIT';
    }
    return matchesSearch;
  });

  const handleOpenReceipt = (txn: any) => {
    setLastTransaction(txn);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
              SIMULATED LEDGER
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Records: {transactions.length}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
            Transaction History & Receipts
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Simulate Top-Up</span>
          </button>

          <button
            onClick={clearLocalHistory}
            title="Clear transaction cache in local storage"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-xs font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Local</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by ID, label, card..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('TOP_UP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer ${
              typeFilter === 'TOP_UP'
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Top-Ups
          </button>
          <button
            onClick={() => setTypeFilter('DEBIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer ${
              typeFilter === 'DEBIT'
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Transit Debits
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {filteredTxns.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs font-mono space-y-2">
            <History className="w-8 h-8 text-zinc-400 mx-auto" />
            <p>No transactions matching filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredTxns.map((txn) => {
              const isTopUp = txn.type === 'TOP_UP' || txn.type === 'INITIAL_LOAD';
              return (
                <div
                  key={txn.transaction_id}
                  onClick={() => handleOpenReceipt(txn)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  {/* Left: Icon and Details */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isTopUp
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {isTopUp ? '+' : '-'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {txn.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {txn.status}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span>{formatDate(txn.timestamp)}</span>
                        <span>•</span>
                        <span className="text-zinc-400">{txn.transaction_id}</span>
                        <span>•</span>
                        <span className="text-zinc-400">{txn.card_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amounts & Balances */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-2 sm:pt-0 font-mono">
                    <div
                      className={`text-base font-bold ${
                        isTopUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {isTopUp ? '+' : '-'}{formatCurrency(txn.amount)}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Balance: {formatCurrency(txn.updated_balance)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
