/**
 * Formatting utilities for YatraTap
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
};

export const maskCardNumber = (num: string): string => {
  if (!num) return '•••• •••• •••• ••••';
  const clean = num.replace(/\s+/g, '');
  if (clean.length < 4) return clean;
  const last4 = clean.slice(-4);
  return `6071 •••• •••• ${last4}`;
};

export const truncateHash = (hash?: string, chars = 12): string => {
  if (!hash) return 'N/A';
  if (hash.length <= chars) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
};

