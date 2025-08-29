"use client"
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

import React from 'react'

export const WalletInfo = () => {
    const {connected, publicKey, wallet } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(connected && publicKey) {
            const getBalance = async ()=> {
            setLoading(true);
            try {
                const balanceOf = await connection.getBalance(publicKey);
                setBalance(balanceOf / LAMPORTS_PER_SOL);

            } catch (error) {
                console.error("Could not get account balance", error)
            } finally {
                setLoading(false);
            }
        }
            getBalance()
        } else {
            setBalance(null);
        }
        
    }, [connected, publicKey, connection])
    

  return (
    <>
    {connected && (
    <div className="text-white">
    <p><strong>Network:</strong> {connection.rpcEndpoint.includes('mainnet') ? 'Mainnet' : 'Devnet'}</p>
    <p><strong>SOL Balance:</strong>
    {loading ? "Loading..." : balance !== null ? `${balance.toFixed(4)} SOL` : "Error loading balance"}</p>
    <p> <strong>Public address:</strong>{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</p>
  </div>
    )
    }
  </>
  )
}
