import {  ParsedTransactionWithMeta } from "@solana/web3.js"

export interface SpamFilterConfig {
    minAmountThreshold: number;
    
}

export const isSpamTransaction = (
    transaction: ParsedTransactionWithMeta,
    config: SpamFilterConfig )
    : boolean => {

    if(!transaction.meta?.preBalances.length || !transaction.meta?.postBalances.length) {
        return false;
    }

    const balanceChange = Math.abs((transaction.meta.postBalances[0] - transaction.meta.preBalances[0]) / 1000000000);

    return balanceChange > 0 && balanceChange < config.minAmountThreshold
}
