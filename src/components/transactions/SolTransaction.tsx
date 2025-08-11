"use client"

import { useWallet } from "@solana/wallet-adapter-react";
import UseTransactions from "@/hooks/UseTransactions";

const SolTransaction = () => {
  const { publicKey } = useWallet();
  const { transactions, loading, error, refetch, totalCount } = UseTransactions(20);

  const formatDate = (blockTime: number | null) => {
    if (!blockTime) return 'Unknown';
    return new Date(blockTime * 1000).toLocaleString();
  };

  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

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
        <h2 className="text-2xl font-bold mb-2">Wallet Transaction History</h2>
        <div className="flex justify-between items-center">
          <p className="text-lg">
            Total Transactions: <strong>{totalCount}</strong>
          </p>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-600 text-center">No transactions found</p>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Recent Transactions:</h3>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div 
                key={tx.signature} 
                className="border rounded-lg p-4 hover:bg-gray-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.status === 'success' ? '✓ Success' : '✗ Failed'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Slot: {tx.slot}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-gray-700 mb-1">
                      {truncateSignature(tx.signature)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(tx.blockTime)}
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => {
                      // TODO: Open transaction details modal or navigate to details page
                      window.open(`https://solscan.io/tx/${tx.signature}`, '_blank');
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolTransaction;