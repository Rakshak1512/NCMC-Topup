import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getApiErrorMessage } from '../services/api';
import type { CardData, TransactionItem, AddCardPayload } from '../services/api';
import { detectDeviceCapabilities } from '../utils/nfcDetector';
import type { DeviceCapabilityReport } from '../utils/nfcDetector';
import type { ScannedCardPayload } from '../services/nfcAdapter';

export type AppPage = 'landing' | 'dashboard' | 'scanner' | 'card' | 'topup' | 'history' | 'settings';

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  card: CardData | null;
  cards: CardData[];
  selectCardById: (cardId: string) => Promise<void>;
  transactions: TransactionItem[];
  isLoadingCard: boolean;
  isLoadingTransactions: boolean;
  backendOnline: boolean;
  deviceReport: DeviceCapabilityReport;
  lastTransaction: TransactionItem | null;
  setLastTransaction: (txn: TransactionItem | null) => void;
  isTopUpModalOpen: boolean;
  setIsTopUpModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  isAddCardModalOpen: boolean;
  setIsAddCardModalOpen: (open: boolean) => void;
  isCardGuideOpen: boolean;
  setIsCardGuideOpen: (open: boolean) => void;
  scannedTagData: ScannedCardPayload | null;
  setScannedTagData: (tag: ScannedCardPayload | null) => void;
  refreshCardData: () => Promise<void>;
  resetCardData: () => Promise<boolean>;
  performTopUp: (amount: number) => Promise<TransactionItem | null>;
  addNewCard: (data: AddCardPayload) => Promise<CardData | null>;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
  clearLocalHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CARD: CardData = {
  card_id: 'NCMC-BY-8021-9943',
  card_type: 'Bharat Yatra NCMC Card',
  issuer: 'State Bank of India / NPCI RuPay',
  standard: 'NCMC / RuPay Contactless (qSPARC v2)',
  card_number_masked: '6071 •••• •••• 8021',
  expiry: '08/29',
  balance: 450.00,
  currency: 'INR',
  status: 'ACTIVE',
  is_demo: true,
  last_updated: new Date().toISOString(),
  notice: 'SIMULATION ONLY – Balance is maintained in-memory for testing and will reset on server restart.',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('dashboard'); // Start on simple clean dashboard!
  const [card, setCard] = useState<CardData | null>(null);
  const [cards, setCards] = useState<CardData[]>([DEFAULT_CARD]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [deviceReport, setDeviceReport] = useState<DeviceCapabilityReport>(detectDeviceCapabilities());
  const [lastTransaction, setLastTransaction] = useState<TransactionItem | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isCardGuideOpen, setIsCardGuideOpen] = useState(false);
  const [scannedTagData, setScannedTagData] = useState<ScannedCardPayload | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Fetch all cards and active card
  const refreshCardData = useCallback(async () => {
    setIsLoadingCard(true);
    try {
      const cardList = await api.listCards();
      if (cardList.cards && cardList.cards.length > 0) {
        setCards(cardList.cards);
        setCard(cardList.cards[0]);
      } else {
        const single = await api.getDemoCard();
        setCard(single);
        setCards([single]);
      }
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
      // Fallback local storage cards
      const saved = localStorage.getItem('yatratap_cards');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCards(parsed);
          setCard(parsed[0] || DEFAULT_CARD);
        } catch {
          setCard(DEFAULT_CARD);
          setCards([DEFAULT_CARD]);
        }
      } else {
        setCard(DEFAULT_CARD);
        setCards([DEFAULT_CARD]);
      }
    } finally {
      setIsLoadingCard(false);
    }
  }, []);

  // Switch card
  const selectCardById = useCallback(async (cardId: string) => {
    try {
      const selected = await api.selectCard(cardId);
      setCard(selected);
      showNotification('info', `Active card switched to ${selected.card_type}`);
    } catch {
      const match = cards.find((c) => c.card_id === cardId);
      if (match) {
        setCard(match);
        showNotification('info', `Switched to ${match.card_type}`);
      }
    }
  }, [cards, showNotification]);

  // Add new card
  const addNewCard = useCallback(async (data: AddCardPayload): Promise<CardData | null> => {
    try {
      const newCard = await api.addCard(data);
      setCards((prev) => [newCard, ...prev.filter((c) => c.card_id !== newCard.card_id)]);
      setCard(newCard);
      showNotification('success', `Card "${newCard.card_type}" added successfully!`);
      return newCard;
    } catch {
      // Local fallback
      const rand = Math.floor(1000 + Math.random() * 9000);
      const localCard: CardData = {
        card_id: data.card_id || `NCMC-BY-${rand}-9943`,
        card_type: data.card_type || 'Bharat Yatra NCMC Card',
        issuer: data.issuer || 'State Bank of India / NPCI RuPay',
        standard: 'NCMC / RuPay Contactless (qSPARC v2)',
        card_number_masked: `6071 •••• •••• ${data.card_number || rand}`,
        expiry: '12/30',
        balance: data.balance || 200,
        currency: 'INR',
        status: 'ACTIVE',
        is_demo: true,
        last_updated: new Date().toISOString(),
        notice: 'SIMULATION ONLY – Balance is maintained in-memory.',
      };
      setCards((prev) => [localCard, ...prev]);
      setCard(localCard);
      localStorage.setItem('yatratap_cards', JSON.stringify([localCard, ...cards]));
      showNotification('success', `Card "${localCard.card_type}" created in local session!`);
      return localCard;
    }
  }, [cards, showNotification]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const res = await api.getTransactions();
      setTransactions(res.transactions);
      localStorage.setItem('yatratap_local_txns', JSON.stringify(res.transactions));
      setBackendOnline(true);
    } catch {
      const saved = localStorage.getItem('yatratap_local_txns');
      if (saved) {
        try {
          setTransactions(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Reset card
  const resetCardData = useCallback(async (): Promise<boolean> => {
    try {
      const res = await api.resetDemoCard();
      setCard(res.card);
      setCards([res.card]);
      await fetchTransactions();
      showNotification('success', 'Demo cards and transaction history reset to default.');
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      showNotification('error', `Failed to reset card: ${msg}`);
      setCard(DEFAULT_CARD);
      setCards([DEFAULT_CARD]);
      return false;
    }
  }, [fetchTransactions, showNotification]);

  // Execute topup
  const performTopUp = useCallback(async (amount: number): Promise<TransactionItem | null> => {
    if (!card) return null;
    try {
      const txn = await api.executeTopUp(card.card_id, amount, 'Simulated Sandbox');
      setCard((prev) => (prev ? { ...prev, balance: txn.updated_balance, last_updated: txn.timestamp } : prev));
      setCards((prev) =>
        prev.map((c) => (c.card_id === card.card_id ? { ...c, balance: txn.updated_balance } : c))
      );
      setTransactions((prev) => [txn, ...prev]);
      setLastTransaction(txn);
      setIsReceiptModalOpen(true);
      showNotification('success', `Simulated top-up of ₹${amount} successful!`);
      return txn;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      showNotification('error', `Top-up failed: ${msg}`);
      return null;
    }
  }, [card, showNotification]);

  const clearLocalHistory = useCallback(() => {
    localStorage.removeItem('yatratap_local_txns');
    setTransactions([]);
    showNotification('info', 'Local transaction cache cleared.');
  }, [showNotification]);

  useEffect(() => {
    setDeviceReport(detectDeviceCapabilities());
    refreshCardData();
    fetchTransactions();
  }, [refreshCardData, fetchTransactions]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        card,
        cards,
        selectCardById,
        transactions,
        isLoadingCard,
        isLoadingTransactions,
        backendOnline,
        deviceReport,
        lastTransaction,
        setLastTransaction,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        isAddCardModalOpen,
        setIsAddCardModalOpen,
        isCardGuideOpen,
        setIsCardGuideOpen,
        scannedTagData,
        setScannedTagData,
        refreshCardData,
        resetCardData,
        performTopUp,
        addNewCard,
        notification,
        showNotification,
        clearNotification,
        clearLocalHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
