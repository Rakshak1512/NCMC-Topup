import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NoticeBanner } from './components/NoticeBanner';
import { TopUpModal } from './components/TopUpModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AddCardModal } from './components/AddCardModal';
import { PhysicalCardGuide } from './components/PhysicalCardGuide';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { CardManagementPage } from './pages/CardManagementPage';
import { TopUpPage } from './pages/TopUpPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage, notification, clearNotification, isCardGuideOpen, setIsCardGuideOpen } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'landing':
        return <LandingPage />;
      case 'scanner':
        return <ScannerPage />;
      case 'card':
        return <CardManagementPage />;
      case 'topup':
        return <TopUpPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-emerald-500 selection:text-zinc-950">
      {/* Simulation Disclaimer Banner */}
      <NoticeBanner />

      {/* Navigation Bar */}
      <Navbar />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md w-full px-4"
          >
            <div
              className={`p-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-center justify-between gap-3 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                  : notification.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-200'
                  : 'bg-zinc-100 dark:bg-zinc-900/90 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={clearNotification}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <TopUpModal />
      <ReceiptModal />
      <AddCardModal />
      {isCardGuideOpen && <PhysicalCardGuide onClose={() => setIsCardGuideOpen(false)} />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
