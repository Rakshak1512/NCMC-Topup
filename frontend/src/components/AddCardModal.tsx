import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const COMMON_ISSUERS = [
  'State Bank of India / NPCI RuPay',
  'Canara Bank / RuPay',
  'HDFC Bank / RuPay Contactless',
  'ICICI Bank / NCMC',
  'Paytm Payments Bank / RuPay',
  'Airtel Payments Bank / NCMC',
  'Axis Bank / RuPay Transit',
  'Delhi Metro Rail Corporation (DMRC)',
];

export const AddCardModal: React.FC = () => {
  const { isAddCardModalOpen, setIsAddCardModalOpen, addNewCard, scannedTagData, showNotification } = useApp();

  const [cardName, setCardName] = useState('Bharat Yatra NCMC Card');
  const [issuer, setIssuer] = useState(COMMON_ISSUERS[0]);
  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('BHARAT COMMUTER');
  const [initialBalance, setInitialBalance] = useState('300');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddCardModalOpen) return null;

  const handleUseScannedData = () => {
    if (scannedTagData) {
      setCardName(scannedTagData.cardType || 'Scanned Physical NCMC Card');
      setCardNumber(scannedTagData.serialNumber.slice(-4));
      showNotification('info', `Imported serial number ${scannedTagData.serialNumber}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const balanceNum = parseFloat(initialBalance) || 0;
    const cleanNum = cardNumber.replace(/\D/g, '') || '8021';

    const newCard = await addNewCard({
      card_type: cardName.trim() || 'Bharat Yatra NCMC Card',
      issuer,
      card_number: cleanNum,
      holder_name: holderName.trim().toUpperCase() || 'BHARAT COMMUTER',
      balance: balanceNum,
      card_id: scannedTagData?.serialNumber || undefined,
    });

    setIsSubmitting(false);
    if (newCard) {
      setIsAddCardModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl text-zinc-900 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Add / Register NCMC Card
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Register a new card profile or connect a scanned physical tag
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCardModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-fill from recent scan button if available */}
        {scannedTagData && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Scanned tag found: <strong>{scannedTagData.serialNumber}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleUseScannedData}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px] cursor-pointer"
            >
              Use This Card
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Card Nickname / Brand
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bharat Yatra NCMC / Delhi Metro Pass"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Issuing Bank / Partner
            </label>
            <select
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              {COMMON_ISSUERS.map((iss) => (
                <option key={iss} value={iss}>
                  {iss}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 8021"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Initial Balance (₹)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="e.g. RAHUL SHARMA"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm uppercase text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddCardModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add & Activate Card'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
