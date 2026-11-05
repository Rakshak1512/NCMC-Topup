import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Trash2,
  RotateCcw,
  Smartphone,
  Server,
  AlertTriangle,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { DeviceBadge } from '../components/DeviceBadge';

export const SettingsPage: React.FC = () => {
  const {
    deviceReport,
    resetCardData,
    clearLocalHistory,
    backendOnline,
    showNotification,
    setIsAddCardModalOpen,
    setIsCardGuideOpen,
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleFullReset = async () => {
    await resetCardData();
    clearLocalHistory();
    setResetConfirmOpen(false);
    showNotification('success', 'Application state reset to factory baseline.');
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Application Settings & System
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Configure interface preferences, inspect device diagnostics, and manage session demo data.
        </p>
      </div>

      {/* Theme Preference Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Interface Theme</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Switch between Dark Mode (Default) and Light Mode.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-emerald-400" />
                <span>Dark Theme</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Physical Card Placement Guide Helper */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Physical Card Placement Guide</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              View visual diagrams showing where to hold your NFC card on Android vs iPhone.
            </p>
          </div>

          <button
            onClick={() => setIsCardGuideOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 cursor-pointer"
          >
            Open Guide
          </button>
        </div>
      </div>

      {/* Device Hardware & Compatibility Matrix */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Device Diagnostics & Web NFC</h3>
          </div>
          <DeviceBadge report={deviceReport} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Operating System</span>
            <span className="text-zinc-900 dark:text-white font-semibold">{deviceReport.osName}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Detected Browser</span>
            <span className="text-zinc-900 dark:text-white font-semibold">{deviceReport.browserName}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Web NFC (NDEFReader)</span>
            <span className={deviceReport.hasNdefReader ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
              {deviceReport.hasNdefReader ? 'Available in Browser' : 'Restricted (Virtual Active)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Origin Security (HTTPS)</span>
            <span className={deviceReport.isSecureContext ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
              {deviceReport.isSecureContext ? 'Secure Context (HTTPS/localhost)' : 'Insecure Origin'}
            </span>
          </div>
        </div>
      </div>

      {/* Backend & Deployment Service Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Backend Simulation Service</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
              backendOnline
                ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400'
            }`}
          >
            {backendOnline ? 'ONLINE' : 'FALLBACK SIMULATION'}
          </span>
        </div>

        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
          <p>• Service: Python FastAPI (uvicorn)</p>
          <p>• Swagger Docs: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">http://localhost:8000/docs</a></p>
          <p>• Storage Mode: In-memory simulation. Resets automatically on backend reload.</p>
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Demo Data & Reset</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Reset demo card balance to ₹450 or clear transaction cache in browser local storage.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
            <span>Reset Demo Cards</span>
          </button>

          <button
            onClick={clearLocalHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-rose-600 dark:text-rose-400 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Factory Reset Demo?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                This will reset all demo card balances to ₹450 and wipe local cache.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFullReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
