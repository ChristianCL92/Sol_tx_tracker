"use client"

import {TransactionService, TransactionSummary} from "../lib/solana/transaction-service";
import { useMemo, useState, useEffect } from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";


interface UseTransactionsResult {
  transactions: TransactionSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
}

const UseTransactions = (limit: number): UseTransactionsResult => {

    const { connection } = useConnection();
    const {publicKey, connect} = useWallet();

    const [ getTransaction, setGetTransaction ] = useState<TransactionSummary[]>([])
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null)
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const transactionService = useMemo(
        () => new TransactionService(connection),
         [connection]
        );

    useEffect(() => {
    const utilizeTransactions = async () => {
        if (!publicKey) {
            setGetTransaction([]);
            setLoading(false);
            return; 
        }
        setLoading(true);
        try {
               if(limit === 0) {
                setGetTransaction([]);
                setLoading(false)
                setError("Please select at least 1 transaction to display");
                return;
                
            }
            const transactionsToGet = await transactionService.getTransactionSignatures(publicKey, limit);
         
            setGetTransaction(transactionsToGet);
            
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch transactions");
            console.error("Did not manage to get transaction data", error)
            
        } finally {
        setLoading(false);

        }
        
    }
        utilizeTransactions();
    }, [ publicKey, connection, limit, refetchTrigger ])
    
const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
}


  return {
    transactions: getTransaction,
    loading,
    error,
    refetch,
    totalCount: getTransaction.length
  }
}

export default UseTransactions