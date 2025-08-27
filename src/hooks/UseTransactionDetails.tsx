"use client"

import {DetaildTransactions, TransactionService } from "@/lib/solana/transaction-service"
import { useConnection} from "@solana/wallet-adapter-react"
import { ParsedTransactionWithMeta } from "@solana/web3.js"
import { useState, useCallback, useMemo } from "react"
import { isSpamTransaction, SpamFilterConfig } from "@/lib/utils/spam-filter"


const UseTransactionDetails = (spamConfig: SpamFilterConfig) => {
    const {connection } = useConnection()
    const [transactionDetails, setTransactionDetails] = useState<ParsedTransactionWithMeta| null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSpamDetected, setIsSpamDetected] = useState(false);

    const transactionService = useMemo(
      () => new TransactionService(connection),
    [connection]
     )
    
    const fetchTransactionDetails = useCallback(async(signature:string):Promise<ParsedTransactionWithMeta| null > => {
        setLoading(true);
        setError(null);
        setIsSpamDetected(false);
     try {
        const parsedTransaction = await transactionService.getParsedTransaction(signature);
        if(parsedTransaction && isSpamTransaction(parsedTransaction, spamConfig)) {
        setTransactionDetails(null);
        setIsSpamDetected(true);
        return null
        }
        setTransactionDetails(parsedTransaction);

        return parsedTransaction;
     } catch (error) {
         console.error("Could not fetch transaction details", error);
         return null;
     } finally {
        setLoading(false);
     }


    }, [transactionService, spamConfig]) 

  return (
    {
        fetchTransactionDetails,
        transactionDetails, 
        loading,
         error,
        isSpamDetected
    }
  )
}

export default UseTransactionDetails