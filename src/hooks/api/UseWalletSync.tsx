import { createWallet, updateWallet, pingWallet, getWallet } from "@/lib/api/wallets/api";
import { WalletBackendPayload } from "@/lib/types/wallet";
import { Connection } from "@solana/web3.js";
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
  const [isWalletSynced, setIsWalletSynced] = useState(false)

  
  const hasWalletBeenChecked = useRef(false)

  const startWallet = async () => {

    if(!publicKey || !connected || balance === null) return;
      setIsLoading(true);
      setError(null);
      
      try {
        const walletExist = await getWallet(publicKey)
         if (walletExist) {
          await syncWalletUpdate()
          setIsWalletSynced(true)
          setLastSyncTime(new Date())
        }
       
      } catch (error: any) {
        if(error.message?.includes("404") || error.message?.includes("not found")) {
          try {
          const walletToCreate: WalletBackendPayload = {
            publicKey,
            network: "mainnet",
            balance: balance || 0,
            preferredTxLimit,
            spamThreshold
          }
          await createWallet(walletToCreate);
          setIsWalletSynced(true)
          setLastSyncTime(new Date())
            
          } catch (createError: any ) {
            setError(createError.message || "Failed To create wallete");
          } 
          
        } else {
          setError(error.message || 'Failed to check wallet');
        console.error('❌ Failed to check wallet:', error);
        } 
      } finally {
        setIsLoading(false)
        hasWalletBeenChecked.current = true;
      }
    
  }
 
    const syncWalletUpdate = async() => {
        if(!publicKey || !connected || !isWalletSynced || balance === null) return;
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
    if (!publicKey || !connected || !isWalletSynced) return;
    
    try {
      await pingWallet(publicKey);
    } catch (err) {
      console.error('❌ Failed to ping wallet:', err);
    }
  };
  
  useEffect(() => {
    if (connected && publicKey && balance !== null || !hasWalletBeenChecked.current) {
      startWallet();
    } else if (!connected) {
      setIsWalletSynced(false);
      hasWalletBeenChecked.current = false;
    }
  }, [connected, publicKey, balance]);
  
useEffect(() => {
    if (connected && publicKey && isWalletSynced && balance !== null) {
      syncWalletUpdate();
    }
  }, [spamThreshold, preferredTxLimit]);
  
  useEffect(() => {
    if (connected && publicKey && isWalletSynced && balance !== null) {
      syncWalletUpdate();
    }
  }, [balance]);
  
  useEffect(() => {
    if (connected && publicKey && isWalletSynced) {
      syncWalletPing();
    }
  }, [connected, isWalletSynced]);
  
  return {
    isLoading,
    error,
    lastSyncTime,
    isWalletSynced
  };
};

