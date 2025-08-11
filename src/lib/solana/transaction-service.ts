import { Connection, PublicKey, ConfirmedSignatureInfo, ParsedTransactionWithMeta} from "@solana/web3.js";

export interface TransactionSummary {
    signature: string;
    slot: number;
    blockTime: number | null
    status: "success" | "failed";
    fee?: number;
    type?: string;

}

export interface DetaildTransactions extends TransactionSummary {
  instructions: any[];
  accountKeys: string[];
  preBalances: number[];
  postBalances: number[];
}

export class TransactionService {
    constructor(private connection: Connection) {}

    async getTransactionSignatures (
        publicKey: PublicKey,
        limit: number = 100
    ): Promise<TransactionSummary[]> {
        try {
            const signatures = await this.connection.getSignaturesForAddress(publicKey, {
                limit,
            })

            return signatures.map(sig => ({
                signature: sig.signature,
                slot: sig.slot,
                blockTime: sig.blockTime ?? null,
                status: sig.err ? "failed" : "success"
            }));
            
        } catch (error) {
            console.error("Error getting transaction signatures", error);
            throw new Error('Failed to fetch transaction signatures');
        }
    }

    async getTransactionDetails(signature: string):Promise<DetaildTransactions | null> {
        try {
            const transactionDetails = await this.connection.getTransaction(signature, {
                maxSupportedTransactionVersion: 0,
                commitment: "confirmed",

            });

            if(!transactionDetails) {
                return null;
            }

             return {
                signature,
                slot: transactionDetails.slot,
                blockTime: transactionDetails.blockTime ?? null,
                status: transactionDetails.meta?.err ? 'failed' : 'success',
                fee: transactionDetails.meta?.fee,
                instructions: transactionDetails.transaction.message.compiledInstructions || [],
                accountKeys: transactionDetails.transaction.message.getAccountKeys().keySegments().flat().map(key => key.toString()),
                preBalances: transactionDetails.meta?.preBalances || [],
                postBalances: transactionDetails.meta?.postBalances || [],
      };
        } catch (error) {
            console.error("Error getting transaction details", error);
            return null;
        }
    }

    async getParsedTransaction(signature: string):Promise<ParsedTransactionWithMeta | null> {
        try {
            const transactionData = await this.connection.getParsedTransaction(signature, {
                maxSupportedTransactionVersion: 0,
                commitment: "confirmed"
            })

            return transactionData;
            
        } catch (error) {
            console.error('Error fetching parsed transaction:', error);
            return null;
        }
    }

    analyseTransactionData (transaction: DetaildTransactions ) {
        if (transaction.instructions.length === 1) {
            return "Single transaction"
        } else if (transaction.instructions.length > 1) {
            return "Complex transaction"
        }
        return "Unknown"
    }

}

