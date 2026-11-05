import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CardData {
  card_id: string;
  card_type: string;
  issuer: string;
  standard: string;
  card_number_masked: string;
  expiry: string;
  balance: number;
  currency: string;
  status: string;
  is_demo: boolean;
  last_updated: string;
  notice: string;
}

export interface AddCardPayload {
  card_type?: string;
  issuer?: string;
  card_number?: string;
  holder_name?: string;
  balance?: number;
  card_id?: string;
}

export interface TopUpPreviewResult {
  amount: number;
  current_balance: number;
  projected_balance: number;
  currency: string;
  convenience_fee: number;
  total_payable: number;
  is_valid: boolean;
  message: string;
  disclaimer: string;
}

export interface TransactionItem {
  transaction_id: string;
  card_id: string;
  amount: number;
  currency: string;
  previous_balance: number;
  updated_balance: number;
  status: string;
  timestamp: string;
  payment_method: string;
  type: string;
  label: string;
  disclaimer: string;
  receipt_hash?: string;
}

export interface TransactionListResponse {
  transactions: TransactionItem[];
  count: number;
  demo_mode: boolean;
  notice: string;
}

export interface BackendHealth {
  status: string;
  service: string;
  environment: string;
  demo_mode: boolean;
  timestamp: string;
  disclaimer: string;
  version: string;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async getHealth(): Promise<BackendHealth> {
    const res = await apiClient.get<BackendHealth>('/health');
    return res.data;
  },

  async getDeviceCapabilities(): Promise<any> {
    const res = await apiClient.get('/device/capabilities');
    return res.data;
  },

  async getDemoCard(cardId?: string): Promise<CardData> {
    const res = await apiClient.get<CardData>('/card/demo', {
      params: cardId ? { card_id: cardId } : undefined,
    });
    return res.data;
  },

  async listCards(): Promise<{ cards: CardData[]; count: number }> {
    const res = await apiClient.get('/card/list');
    return res.data;
  },

  async addCard(data: AddCardPayload): Promise<CardData> {
    const res = await apiClient.post<CardData>('/card/add', data);
    return res.data;
  },

  async selectCard(cardId: string): Promise<CardData> {
    const res = await apiClient.post<CardData>(`/card/select/${cardId}`);
    return res.data;
  },

  async resetDemoCard(): Promise<{ success: boolean; message: string; card: CardData }> {
    const res = await apiClient.post('/card/demo/reset');
    return res.data;
  },

  async previewTopUp(amount: number): Promise<TopUpPreviewResult> {
    const res = await apiClient.post<TopUpPreviewResult>('/topup/preview', { amount });
    return res.data;
  },

  async executeTopUp(cardId: string, amount: number, paymentMethod = 'Simulated Sandbox'): Promise<TransactionItem> {
    const res = await apiClient.post<TransactionItem>('/topup/demo', {
      card_id: cardId,
      amount,
      payment_method: paymentMethod,
    });
    return res.data;
  },

  async getTransactions(): Promise<TransactionListResponse> {
    const res = await apiClient.get<TransactionListResponse>('/transactions');
    return res.data;
  },

  async getTransactionById(transactionId: string): Promise<TransactionItem> {
    const res = await apiClient.get<TransactionItem>(`/transactions/${transactionId}`);
    return res.data;
  },
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: string }>;
    if (axiosErr.response?.data?.detail) {
      return axiosErr.response.data.detail;
    }
    if (axiosErr.code === 'ECONNREFUSED' || axiosErr.message.includes('Network Error')) {
      return 'Backend service is offline. Please ensure the Python FastAPI backend is running on port 8000.';
    }
    return axiosErr.message;
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};
