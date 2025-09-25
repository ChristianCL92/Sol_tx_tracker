"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWalletSync } from '@/hooks/api/UseWalletSync';
import {WalletSyncContextType} from "@/lib/types/contextValues";

const WalletSyncContext = createContext<WalletSyncContextType | undefined>(undefined);

export const useWalletSyncContext = () => {
  const context = useContext(WalletSyncContext);
  if (!context) {
    throw new Error('useWalletSyncContext must be used within WalletSyncProvider');
  }
  return context;
};

interface WalletSyncProviderProps {
  children: ReactNode;
}

export const WalletSyncProvider = ({ children }: WalletSyncProviderProps) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [spamThreshold, setSpamThreshold] = useState<number>(0);
  const [preferredTxLimit, setPreferredTxLimit] = useState<number>(10);
  const [balanceLoading, setBalanceLoading] = useState(false);
  
  const { isLoading, error } = useWalletSync(
    publicKey?.toBase58() || null,
    connected,
    balance,
    preferredTxLimit,
    spamThreshold
  );
  
  const refreshBalance = async () => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }
    
    setBalanceLoading(true);
    try {
      const balanceOf = await connection.getBalance(publicKey);
      setBalance(balanceOf / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Could not get account balance", error);
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };
  
  useEffect(() => {
    refreshBalance();
  }, [connected, publicKey, connection]);
  
  const updateSpamThreshold = (threshold: number) => {
    setSpamThreshold(threshold);
  };
  
  const updatePreferredTxLimit = (limit: number) => {
    setPreferredTxLimit(limit);
  };
  
  return (
    <WalletSyncContext.Provider
      value={{
        balance,
        spamThreshold,
        preferredTxLimit,
        isLoading: isLoading || balanceLoading,
        error,
        updateSpamThreshold,
        updatePreferredTxLimit,
        
      }}
    >
      {children}
    </WalletSyncContext.Provider>
  );
};