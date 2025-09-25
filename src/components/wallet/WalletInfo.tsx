"use client"
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletSyncContext } from "@/context/WalletSyncContext"
import React from 'react'

export const WalletInfo = () => {
    const {connected, publicKey, wallet } = useWallet();
    const { connection } = useConnection();
    const {balance, isLoading } = useWalletSyncContext()

  return (
    <>
    {connected && (
    <div className="text-white">
    <p><strong>Network:</strong> {connection.rpcEndpoint.includes('mainnet') ? 'Mainnet' : 'Devnet'}</p>
    <p><strong>SOL Balance:</strong>
    {isLoading ? "Loading..." : balance !== null ? `${balance.toFixed(4)} SOL` : "Error loading balance"}</p>
    <p> <strong>Public address:</strong>{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</p>
  </div>
    )
    }
  </>
  )
}
