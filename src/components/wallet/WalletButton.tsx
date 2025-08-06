"use client"
import React from 'react'
import { WalletMultiButton, WalletDisconnectButton  } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"

const WalletButton = () => {
    const { connected } = useWallet();
    
  return (
    <div>
        {connected ? <WalletDisconnectButton /> : <WalletMultiButton />  }
    </div>
  )
}

export default WalletButton
