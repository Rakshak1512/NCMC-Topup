import React from 'react';
import { motion } from 'framer-motion';
import { Radio, RotateCcw, Zap, Plus } from 'lucide-react';
import type { CardData } from '../services/api';
import { formatCurrency, maskCardNumber } from '../utils/formatters';

interface CardPreviewProps {
  card: CardData | null;
  cards?: CardData[];
  onSelectCard?: (cardId: string) => void;
  onReset?: () => void;
  onQuickTopUp?: () => void;
  onAddCard?: () => void;
  interactive?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  cards = [],
  onSelectCard,
  onReset,
  onQuickTopUp,
  onAddCard,
  interactive = true,
}) => {
  const balance = card?.balance ?? 450.0;
  const cardNumber = card?.card_number_masked || '6071 •••• •••• 8021';
  const expiry = card?.expiry || '08/29';
  const cardId = card?.card_id || 'NCMC-BY-8021-9943';
  const cardType = card?.card_type || 'Bharat Yatra NCMC Card';

  return (
    <div className="relative group max-w-md w-full mx-auto select-none space-y-3">
      {/* Card Selector Pills if multiple cards */}
      {cards.length > 1 && onSelectCard && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
            Select Card:
          </span>
          {cards.map((c) => {
            const isSelected = c.card_id === card?.card_id;
            return (
              <button
                key={c.card_id}
                onClick={() => onSelectCard(c.card_id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                {c.card_type.length > 16 ? c.card_type.slice(0, 14) + '...' : c.card_type}
              </button>
            );
          })}
        </div>
      )}

      {/* Outer ambient glow */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-600/30 rounded-3xl blur-xl opacity-75"></div>

        <motion.div
          whileHover={interactive ? { scale: 1.02 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative aspect-[1.586/1] w-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-xl border border-white/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white backdrop-blur-xl"
        >
          {/* Holographic angled sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-emerald-400/10 pointer-events-none transform -skew-x-12 opacity-60"></div>
          <div className="absolute -right-16 -top-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header: Issuer, Brand & Contactless Icon */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {cardType.slice(0, 18).toUpperCase()}
                </span>
                <span className="text-[10px] tracking-wider text-zinc-400 font-mono">
                  {cardId}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium tracking-tight mt-1">
                {card?.issuer || 'National Common Mobility Card'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div className="text-right">
                <span className="text-xs font-black tracking-tighter text-white block">
                  RuPay
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-semibold block">
                  qSPARC
                </span>
              </div>
            </div>
          </div>

          {/* Middle: EMV Contact Chip Graphic & Balance */}
          <div className="relative z-10 flex items-center justify-between my-auto py-2">
            {/* Realistic Gold EMV Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center relative overflow-hidden border border-amber-300/60">
              <div className="w-full h-full border border-amber-700/40 rounded-[3px] flex flex-col justify-between p-1 opacity-80">
                <div className="h-[1px] bg-amber-800/50 w-full"></div>
                <div className="h-[1px] bg-amber-800/50 w-full"></div>
                <div className="flex justify-between w-full">
                  <div className="w-1 h-3 border-r border-amber-800/50"></div>
                  <div className="w-1 h-3 border-l border-amber-800/50"></div>
                </div>
              </div>
            </div>

            {/* Balance Display Pill */}
            <div className="text-right bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-inner">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Demo Balance
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                {formatCurrency(balance)}
              </div>
            </div>
          </div>

          {/* Bottom Details: Card Number, Expiry, Cardholder */}
          <div className="relative z-10">
            <div className="font-mono text-base sm:text-lg tracking-widest text-zinc-100 font-semibold drop-shadow-sm mb-2">
              {maskCardNumber(cardNumber)}
            </div>

            <div className="flex items-end justify-between text-xs text-zinc-300">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-mono">
                  Cardholder
                </span>
                <span className="font-semibold tracking-wide text-zinc-200">
                  BHARAT COMMUTER (DEMO)
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-mono">
                  Valid Thru
                </span>
                <span className="font-mono font-medium tracking-widest text-zinc-200">
                  {expiry}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="flex items-center justify-between gap-2">
        {onQuickTopUp && (
          <button
            onClick={onQuickTopUp}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-zinc-950" />
            Top-Up This Card
          </button>
        )}

        {onAddCard && (
          <button
            onClick={onAddCard}
            title="Add a new simulated or physical card"
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold text-xs transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Card</span>
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            title="Reset Demo Balance to ₹450"
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-xs transition-all active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
