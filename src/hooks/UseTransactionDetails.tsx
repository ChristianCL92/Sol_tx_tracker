"use client"

import {DetaildTransactions, TransactionService } from "@/lib/solana/transaction-service"
import { useConnection} from "@solana/wallet-adapter-react"
import { useState, useCallback, useMemo } from "react"


const UseTransactionDetails = () => {
    const {connection } = useConnection()
    const [useDetailedTransactions, setUseDetailedTransactions] = useState<DetaildTransactions | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transactionService = useMemo(
    () => new TransactionService(connection),
    [connection]
     )
  
    const fetchTransactionDetails = useCallback(async(signature:string):Promise<DetaildTransactions | null > => {
        setLoading(true);
        setError(null);
     try {
        const transactionDetails = await transactionService.getTransactionDetails(signature);
        setUseDetailedTransactions(transactionDetails);
        return transactionDetails;
     } catch (error) {
         console.error("Could not fetch transaction details", error);
         return null;
     } finally {
        setLoading(false);
     }


    }, [transactionService]) 

  return (
    {
        fetchTransactionDetails, transactionDetails: useDetailedTransactions, loading, error
    }
  )
}

export default UseTransactionDetails