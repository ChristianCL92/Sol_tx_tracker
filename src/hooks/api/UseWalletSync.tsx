import { createWallet, updateWallet, pingWallet } from "@/lib/api/wallets/api";
import { WalletBackendPayload } from "@/lib/types/wallet";
import { useState, useEffect, useRef } from "react";

export const useWalletSync = (
    publicKey: string | null,
    connected: boolean,
    balance: number | null,
    preferredTxLimit: number,
    spamThreshold: number

) => {
 const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const walletCreatedRef = useRef(false);

  const syncWalletCreation = async() => {
   
    if(!publicKey || !connected || walletCreatedRef.current) return;
    
    setIsLoading(true)
    setError(null)
    try {
        const walletData: WalletBackendPayload = {
            publicKey,
            network : "mainnet",
            balance: balance || 0,
            preferredTxLimit,
            spamThreshold
        }
      console.log('About to send to backend:', walletData);
        await createWallet(walletData)
        walletCreatedRef.current = true;
        console.log("wallet Synced with backend");
        setLastSyncTime(new Date())
    } catch (err) {
        if (err instanceof Error && err.message.includes('already present')) {
        walletCreatedRef.current = true;
        console.log(' Wallet already exists in backend');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create wallet');
                console.error('❌ Failed to create wallet:', err);
    } 
    
    }    finally {
        setIsLoading(false)
    }

    }

    const syncWalletUpdate = async() => {
        if(!publicKey || !connected || !walletCreatedRef.current) return;
        setIsLoading(true)
        setError(null)

        try {
         const updateParameters = {
            publicKey,
            network: "mainnet",
            balance : balance || 0,
            preferredTxLimit,
            spamThreshold
         }
         await updateWallet(publicKey, updateParameters)
            setLastSyncTime(new Date())
            console.log(' Wallet updated in backend');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update wallet');
            console.error('❌ Failed to update wallet:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const syncWalletPing = async () => {
    if (!publicKey || !connected || !walletCreatedRef.current || balance === null) return;
    
    try {
      await pingWallet(publicKey);
    } catch (err) {
      console.error('❌ Failed to ping wallet:', err);
    }
  };
  
  useEffect(() => {
    if (connected && publicKey && balance !== null) {
      syncWalletCreation();
    } else {
      walletCreatedRef.current = false;
    }
  }, [connected, publicKey, balance]);
  
  useEffect(() => {
    if (connected && publicKey && walletCreatedRef.current && balance !== null) {
      syncWalletUpdate();
    }
  }, [spamThreshold, preferredTxLimit, balance]);
  
  useEffect(() => {
    if (connected && publicKey && walletCreatedRef.current && balance !== null) {
      syncWalletUpdate();
    }
  }, [balance]);
  
  useEffect(() => {
    if (connected && publicKey && walletCreatedRef.current) {
      syncWalletPing();
    }
  }, [connected]);
  
  return {
    isLoading,
    error,
    lastSyncTime,
    isWalletSynced: walletCreatedRef.current
  };
};

