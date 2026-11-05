import React, { useState } from 'react';
import {
  Radio,
  LayoutDashboard,
  Scan,
  CreditCard,
  Zap,
  History,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AppPage } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    backendOnline,
    setIsTopUpModalOpen,
    setIsAddCardModalOpen,
    setIsCardGuideOpen,
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'scanner', label: 'Scan NFC', icon: <Scan className="w-4 h-4" /> },
    { id: 'card', label: 'My Cards', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'topup', label: 'Top-Up', icon: <Zap className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  ];

  const handleNav = (page: AppPage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                Yatra<span className="text-emerald-500">Tap</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
                NCMC DEMO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{backendOnline ? 'API Connected' : 'Simulated Ledger'}</span>
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Where to Tap Card Helper Button */}
          <button
            onClick={() => setIsCardGuideOpen(true)}
            title="Where to tap physical card on phone"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tap Guide</span>
          </button>

          {/* Add Card Button */}
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Add Card</span>
          </button>

          {/* Quick TopUp Button */}
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Top-Up</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAddCardModalOpen(true);
              }}
              className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Add Card</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCardGuideOpen(true);
              }}
              className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Tap Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
