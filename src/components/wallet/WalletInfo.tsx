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
    <p><strong>SOL Balance:</strong>
    {isLoading ? "Loading..." : balance !== null ? `${balance.toFixed(4)} SOL` : "Error loading balance"}</p>
  </div>
    )
    }
  </>
  )
}
