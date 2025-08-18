"use client"

import {DetaildTransactions, TransactionService } from "@/lib/solana/transaction-service"
import { useConnection} from "@solana/wallet-adapter-react"
import { ParsedTransactionWithMeta } from "@solana/web3.js"
import { useState, useCallback, useMemo } from "react"


const UseTransactionDetails = () => {
    const {connection } = useConnection()
    const [transactionDetails, setTransactionDetails] = useState<ParsedTransactionWithMeta| null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transactionService = useMemo(
    () => new TransactionService(connection),
    [connection]
     )
  
    const fetchTransactionDetails = useCallback(async(signature:string):Promise<ParsedTransactionWithMeta| null > => {
        setLoading(true);
        setError(null);
     try {
        const parsedTransaction = await transactionService.getParsedTransaction(signature);
        setTransactionDetails(parsedTransaction);
        return parsedTransaction;
     } catch (error) {
         console.error("Could not fetch transaction details", error);
         return null;
     } finally {
        setLoading(false);
     }


    }, [transactionService]) 

  return (
    {
        fetchTransactionDetails,
        transactionDetails, 
        loading,
         error
    }
  )
}

export default UseTransactionDetails