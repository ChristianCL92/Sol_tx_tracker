"use client"

import { useWallet } from "@solana/wallet-adapter-react";
import UseTransactions from "@/hooks/UseTransactions";
import UseTransactionDetails from "@/hooks/UseTransactionDetails";
import { useState } from "react";

const SolTransaction = () => {
  const { publicKey } = useWallet();
  const { transactions, loading, error, refetch, totalCount } = UseTransactions(20);
  const { fetchTransactionDetails, transactionDetails, loading: detailsLoading} = UseTransactionDetails();
  const [ showSelectedTransaction, setShowSelectedTransaction ] = useState<string | null>(null)

  const formatDate = (blockTime: number | null) => {
    if (!blockTime) return 'Unknown';
    return new Date(blockTime * 1000).toLocaleString();
  };

  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`
  } 

  const handleViewDetails = (signature: string) => {
    if(showSelectedTransaction === signature) {
      setShowSelectedTransaction(null);
    } else {
      setShowSelectedTransaction(signature);
      return fetchTransactionDetails(signature);
    }

  }
  
  if (!publicKey) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-600">Please connect your wallet to view transactions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-600">Loading transactions...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 w-2/6 mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-lg">
            Latest Transactions: <strong>{totalCount}</strong>
          </p>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      {<div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.signature} className="border rounded-lg p-4">
            
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm font-mono">
                  {truncateSignature(tx.signature)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(tx.blockTime)}
                </div>
              </div>
              <button 
                className="text-white hover:text-gray-500 text-sm border p-1 bg-amber-950"
                onClick={() => handleViewDetails(tx.signature)}
                disabled={detailsLoading && showSelectedTransaction === tx.signature}
              >
                {detailsLoading && showSelectedTransaction === tx.signature ? 'Loading...' : 
                transactionDetails && showSelectedTransaction === tx.signature ? "Hide Details" : "View Details" }
              </button>
            </div>
            {showSelectedTransaction === tx.signature && transactionDetails && (
              <div className="mt-4 p-3 bg-gray-200 rounded">
                <h4 className="font-semibold mb-2">Transaction Details:</h4>
                <p><strong>Fee:</strong> {(transactionDetails.meta?.fee ?? 0) / 1000000000} Sol</p>

                {transactionDetails.meta?.preBalances && transactionDetails.meta?.postBalances && (
                  <div className="mt-2 p-2">
                  <p><strong>Balance changes</strong></p>
                         {transactionDetails.meta.preBalances.map((preBal, index) => {
                  const postBal = transactionDetails.meta!.postBalances[index];
                  const change = (postBal - preBal) / 1000000000; // Converting lamports to SOL
                  if (change !== 0) {
                    return (
                        <p key={index} className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                         Account {index + 1}: {change > 0 ? '+' : ''}{change.toFixed(9)} SOL
                       </p>
                 )};
                     return null;
              })}
                  </div>
                )}

                {/* Transaction Details */}
                {transactionDetails.transaction?.message?.instructions && (
                  <div className="mt-3 p-2">
                    <p><strong>Instructions:</strong></p>
                    {transactionDetails.transaction.message.instructions.map((instruction, index) => (
                      <div key={index} className="text-sm bg-gray-100 p-2 rounded mt-2">
                        {"parsed" in instruction ? (
                          <>
                            <p><strong>Instruction {index + 1}:</strong> {instruction.parsed?.type || 'Unknown'}</p>
                            {instruction.parsed?.info && (
                              <div className="mt-1">
                                {/* Readable instruction info displayed */}
                                {instruction.parsed.type === 'transfer' && (
                                  <div className="text-xs">
                                    <p>Amount: {(instruction.parsed.info.lamports / 1000000000).toFixed(9)} SOL</p>
                                    <p>From: {instruction.parsed.info.source?.slice(0, 8)}...{instruction.parsed.info.source?.slice(-8)}</p>
                                    <p>To: {instruction.parsed.info.destination?.slice(0, 8)}...{instruction.parsed.info.destination?.slice(-8)}</p>
                                  </div>
                                )}
                                {/*Instructions not parsed by Solana RPC*/}
                                {instruction.parsed.type !== 'transfer' && (
                                  <pre className="text-xs mt-1 overflow-x-auto bg-white p-1 rounded">
                                    {JSON.stringify(instruction.parsed.info, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <p><strong>Instruction {index + 1}:</strong> Partially decoded - {instruction.programId.toString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        
      </div> }
      
    </div>
  );
};

export default SolTransaction;