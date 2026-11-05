import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-zinc-500 dark:text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Brand & Purpose */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
              Yatra<span className="text-emerald-500">Tap</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
              SIMULATION ENGINE v1.0
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md text-xs">
            YatraTap is an engineering simulation and research tool for exploring National Common Mobility Card (NCMC)
            contactless interactions and simulated balance top-up workflows.
          </p>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Zero Real Financial Accounts – Safe Educational Sandbox</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase font-mono font-bold text-zinc-900 dark:text-zinc-200 tracking-wider">
            Exploration
          </h4>
          <ul className="space-y-1 font-medium text-xs">
            <li>
              <button
                onClick={() => setActivePage('dashboard')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('scanner')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                NFC Capability Scanner
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('card')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Card Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('topup')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Top-Up Engine
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('history')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Transaction History
              </button>
            </li>
          </ul>
        </div>

        {/* Architecture & Specs */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase font-mono font-bold text-zinc-900 dark:text-zinc-200 tracking-wider">
            Technical Specs
          </h4>
          <ul className="space-y-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <li>• Standard: RuPay qSPARC v2</li>
            <li>• Frequency: 13.56 MHz HF</li>
            <li>• Protocol: ISO/IEC 14443 Type A/B</li>
            <li>• API: Web NFC (NDEFReader)</li>
            <li>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline mt-1"
              >
                <span>FastAPI Swagger Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom disclaimer bar */}
      <div className="max-w-6xl mx-auto pt-4 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
        <div>
          DEMO TRANSACTION – NO REAL MONEY TRANSFERRED – PHYSICAL CARD NOT UPDATED.
        </div>
        <div>
          © 2026 YatraTap • Designed for NCMC Research
        </div>
      </div>
    </footer>
  );
};
