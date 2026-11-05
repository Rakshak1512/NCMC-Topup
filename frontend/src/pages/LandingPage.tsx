import React from 'react';
import {
  Radio,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CardPreview } from '../components/CardPreview';
import { DeviceBadge } from '../components/DeviceBadge';

export const LandingPage: React.FC = () => {
  const {
    setActivePage,
    card,
    cards,
    selectCardById,
    deviceReport,
    resetCardData,
    setIsTopUpModalOpen,
    setIsAddCardModalOpen,
    setIsCardGuideOpen,
  } = useApp();

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="flex justify-center">
          <DeviceBadge report={deviceReport} showDetails />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
          Universal <span className="text-emerald-500">NCMC Card</span> Top-Up Simulation
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
          Contactless smart card reader & balance simulation for <strong>Bharat Yatra</strong> and RuPay NCMC transit cards in modern web browsers.
        </p>

        {/* Demo Disclaimer */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.</span>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage('scanner')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Radio className="w-4 h-4 fill-zinc-950" />
            <span>Start NFC Scanning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold text-sm cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Open Dashboard</span>
          </button>

          <button
            onClick={() => setIsCardGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-medium text-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Where to Tap?</span>
          </button>
        </div>
      </section>

      {/* Card Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
        <div className="md:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs uppercase font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Bharat Yatra NCMC Digital Twin</span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Simulate Transit Top-Up in Real-Time
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            National Common Mobility Card (NCMC) enables interoperable travel across Metros, Buses, and Tolls in India with RuPay qSPARC dual-interface contactless technology.
          </p>

          <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Offline Stored Value Area (SVA) Wallet Simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant In-Memory Balance Calculations & Cryptographic Receipt Hash</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Register Multiple Custom or Scanned Physical Cards</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Simulate ₹200 Top-Up</span>
            </button>
            <button
              onClick={() => setIsAddCardModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Add Custom Card</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-6">
          <CardPreview
            card={card}
            cards={cards}
            onSelectCard={selectCardById}
            onReset={resetCardData}
            onQuickTopUp={() => setIsTopUpModalOpen(true)}
            onAddCard={() => setIsAddCardModalOpen(true)}
          />
        </div>
      </section>
    </div>
  );
};
