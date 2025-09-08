"use client"

import { useWallet } from "@solana/wallet-adapter-react";
import UseTransactionsQuery from "@/hooks/UseTransactions";
import transactionDetailsQuery from "@/hooks/UseTransactionDetails";
import { useMemo, useState } from "react";

const SolTransaction = () => {
  const { publicKey } = useWallet();
  const [selectTxQuantity, setSelectTxQuantity] = useState(10)
  const [showTxSection, setShowTxSection] = useState(false);

   const txQuantity = useMemo(
    () => (
      selectTxQuantity
    
), [selectTxQuantity])
  
  const { transactions, loading, error, refetch, totalCount } = UseTransactionsQuery(txQuantity);
  const [spamThreshold, setSpamThreshold] = useState(0);
  const [showSpamSettings, setShowSpamSettings] = useState(false);
  
  const spamConfig = useMemo(
    () => ({
      minAmountThreshold: spamThreshold
    }
  ), [spamThreshold])

 

  const [ showSelectedTransaction, setShowSelectedTransaction ] = useState<string | null>(null)
  const {  transactionDetails, loading: detailsLoading, isSpamDetected} = transactionDetailsQuery(showSelectedTransaction || ""  , spamConfig);

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
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
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
          onClick={() => setShowTxSection(!showTxSection)}
          className="px-3 py-1 bg-gray-200 rounded cursor-pointer">
            {showTxSection ? "Close" : "Tx Amount"}
          </button>
          <div className="flex gap-2">
          <button 
            onClick={() => refetch}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm cursor-pointer"
          >
            Refresh
          </button>
          <button 
            onClick={() => setShowSpamSettings(!showSpamSettings)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
            {showSpamSettings ? "❌-Close": "⚙️ Spam Filter"}
            </button>
          </div>
        </div>
            {showSpamSettings && (
              <div className="mb-2 p-3 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold">Spam Filter Settings</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <label htmlFor="spam-threshold" className="text-sm">Hide Transactions below</label>
                  <input 
                  type="number" 
                  min={0}
                  max={1}
                  step="0.0001"
                  value={spamThreshold}
                  onChange={(e)=> setSpamThreshold(Number(e.target.value))
}
                  className="px-4 rounded-lg border w-25 focus: outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <p className="text-sm">SOL</p>
                </div>
                <div className="flex gap-4">
                    <span className="text-sm">Quick set</span>
                  <button 
                onClick={() => setSpamThreshold(0.0001)}
                className={`px-2 py-1 text-xs rounded ${spamThreshold === 0.0001 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Ultra Strict (0.0001)
              </button>
              <button 
                onClick={() => setSpamThreshold(0.001)}
                className={`px-2 py-1 text-xs rounded ${spamThreshold === 0.001 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Strict (0.001)
              </button>
              <button 
                onClick={() => setSpamThreshold(0.01)}
                className={`px-2 py-1 text-xs rounded ${spamThreshold === 0.01 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Lenient (0.01)
              </button>                  
                </div>
              </div>

              </div>
            )}
                {showTxSection && (
            <div className="mb-2 p-3 rounded-lg bg-gray-50 ">
             <h3 className="font-semibold">
              Set Transactions to display
             </h3>
             <label htmlFor="Select Transaction count"></label>
             <input 
             type="number"
              min={0}
              value={selectTxQuantity}
              onChange={(e) =>setSelectTxQuantity(Number(e.target.value))}
              className="border rounded-lg px-4"
              />
            </div>)
            }
      </div>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.signature} className="border rounded-lg p-4 bg-gray-50">
            
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm font-mono">
                  {truncateSignature(tx.signature)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(tx.blockTime)}
                </div>
                {isSpamDetected && showSelectedTransaction === tx.signature && (
                  <div className="text-center py-4">
                    <p className="text-orange-600 font-bold">🚫 Spam transaction hidden</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Transaction amount below threshold {spamThreshold} SOL
                    </p>
                </div>)}
              </div>
              <button 
                className="text-white hover:text-gray-500 text-sm border p-1 bg-amber-950 cursor-pointer rounded-lg"
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
                  const change = (postBal - preBal) / 1000000000; 
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
                                {instruction.parsed.type === 'transfer' && (
                                  <div className="text-xs">
                                    <p>Amount: {(instruction.parsed.info.lamports / 1000000000).toFixed(9)} SOL</p>
                                    <p>From: {instruction.parsed.info.source?.slice(0, 8)}...{instruction.parsed.info.source?.slice(-8)}</p>
                                    <p>To: {instruction.parsed.info.destination?.slice(0, 8)}...{instruction.parsed.info.destination?.slice(-8)}</p>
                                  </div>
                                )}
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

        
      </div> 
      
    </div>
  );
};

export default SolTransaction;