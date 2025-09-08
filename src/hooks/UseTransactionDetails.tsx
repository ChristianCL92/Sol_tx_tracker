"use client"

import { TransactionService } from "@/lib/solana/transaction-service"
import { useConnection} from "@solana/wallet-adapter-react"
import { useMemo } from "react"
import { isSpamTransaction, SpamFilterConfig } from "@/lib/utils/spam-filter"
import { useQuery } from "@tanstack/react-query"

const transactionDetailsQuery = (signature: string, spamConfig: SpamFilterConfig) => {
  const {connection} = useConnection()
  

  const transactionService = useMemo((
  ) => (
      new TransactionService(connection)
  ), [connection])

  const queryDetailResult = useQuery({
    queryKey: ["txDetails", signature ],
    queryFn: async () => {
        if(!connection) {
          throw new Error("No existing connection available");
        }
        return await transactionService.getParsedTransaction(signature)

    },
    enabled: !!signature
  })

  const isSpamDetected = queryDetailResult.data ? isSpamTransaction(queryDetailResult.data, spamConfig) : false

  return {
    transactionDetails: queryDetailResult.data || null,
    loading: queryDetailResult.isLoading,
    isSpamDetected

  }
}

export default transactionDetailsQuery