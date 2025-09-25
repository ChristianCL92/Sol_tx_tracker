export interface WalletSyncContextType {
  balance: number | null;
  spamThreshold: number;
  preferredTxLimit: number;
  isLoading: boolean;
  error: string | null;
  updateSpamThreshold: (threshold: number) => void;
  updatePreferredTxLimit: (limit: number) => void;
}