import { useState, useEffect, useRef } from "react";
import { WalletBackendPayload } from "@/lib/types/wallet";
import { UseCreateWalletMutation, UseUpdateWalletMutation, UsePingWalletMutation } from "../UseWalletMutations";
import { getWallet } from "@/lib/api/wallets/api";

export const useWalletSync = (
    publicKey: string | null,
    connected: boolean,
    balance: number | null,
    preferredTxLimit: number,
    spamThreshold: number

) => {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isWalletSynced, setIsWalletSynced] = useState(false)
  const hasWalletBeenChecked = useRef(false)

  const createMutation = UseCreateWalletMutation()
  const updateMutation = UseUpdateWalletMutation()
  const pingMutation = UsePingWalletMutation()

  const startWallet = async () => {

    if(!publicKey || !connected || balance === null) return;
     
      try {
        const walletExist = await getWallet(publicKey)
         if (walletExist) {
          await syncWalletUpdate()
          setIsWalletSynced(true)
          setLastSyncTime(new Date())
        }
       
      } catch (error: any) {
        if(error.message?.includes("404") || error.message?.includes("not found")) {
          const walletToCreate: WalletBackendPayload = {
            publicKey,
            network: "mainnet",
            balance: balance || 0,
            preferredTxLimit,
            spamThreshold
          }
           createMutation.mutate(walletToCreate, {
            onSuccess: () => {
              setIsWalletSynced(true)
              setLastSyncTime(new Date())
            }
           }) 
        } else {
           console.error("❌ Failed to execute:", error);
        } 
      } finally {
        hasWalletBeenChecked.current = true;
      }
    
  }
 
    const syncWalletUpdate = async() => {
        if(!publicKey || !connected || !isWalletSynced || balance === null) return;
         const updateParameters = {
            publicKey,
            network: "mainnet",
            balance : balance || 0,
            preferredTxLimit,
            spamThreshold
         }
           updateMutation.mutate({publicKey, data: updateParameters}, 
            {onSuccess: () => {
              setLastSyncTime(new Date());
            }
          }
        )        
    }

    const syncWalletPing = async () => {
    if (!publicKey || !connected || !isWalletSynced) return;
        pingMutation.mutate(publicKey)
      
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
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error?.message || 
           updateMutation.error?.message || 
           null,
    lastSyncTime,
    isWalletSynced
  }
};

