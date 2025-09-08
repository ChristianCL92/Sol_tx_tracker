"use client"

import {TransactionService} from "../lib/solana/transaction-service";
import { useMemo } from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

const UseTransactionsQuery = (limit:number) => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()

    const transactionService = useMemo(
        () => new TransactionService(connection),
         [connection]
        );

    const queryResult = useQuery({
        queryKey: ["transactions", publicKey?.toBase58(), limit ],

        queryFn:  async () => {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }

            if(limit === 0) {
                throw new Error("Please select at least 1 transaction");
            }

            return await transactionService.getTransactionSignatures(publicKey, limit);
        },
        enabled: !!publicKey && limit > 0
        
    })

    return {
        transactions: queryResult.data || [],
        loading: queryResult.isLoading,
        error: queryResult.error?.message || null,
        refetch: queryResult.refetch,
        totalCount: queryResult.data?.length || 0
    }

}

export default UseTransactionsQuery;