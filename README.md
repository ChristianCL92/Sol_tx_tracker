## Solana Transaction Tracker

A modern web application for tracking and analyzing Solana blockchain transactions with built-in spam detection capabilities.

##  🌟Overview

This application provides a user-friendly interface for Solana wallet holders to view their transaction history, filter spam transactions, and manage their preferences. Built with Next.js and TypeScript, it offers real-time wallet synchronization and customizable filtering options.

## ✨ Features

- Wallet Connection: Seamless integration with Phantom and other Solana wallets
- Transaction History: View detailed transaction information from the Solana blockchain
- Spam Detection: Smart filtering to identify and hide spam transactions
- User Preferences: Customizable spam threshold and transaction display limits
- Real-time Balance: Live SOL balance tracking
- Data Persistence: Automatic synchronization with backend API for data persistence

## 📋 Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or bun package manager
- A Solana wallet (Phantom recommended)

## 🚀 Getting Started

1. Clone the repository:

- git clone https://github.com/ChristianCL92/Sol_tx_tracker
  cd sol-transaction-tracker

2. Install Dependencies 

npm install
# or
bun install

3. Set up environment variables: Create a .env.local file in the root directory:

NEXT_PUBLIC_SOLANA_API_KEY=your_alchemy_api_key_here

alchemy api key can be generated at: https://www.alchemy.com/

## 4 Ensure the backend API is running:
This frontend application can send http requests to the Backend Transaction API, running on port 3001. See the backend repository for setup instructions. (https://github.com/ChristianCL92/Backend-Sol-tx)

## 5 Start the development sever:

npm run dev
# or
bun run dev

## 6 Open http://localhost:3000 in your browser
--------------------------------------------------------------------------------------------------

## 🔗 Backend Integration
This application works in conjunction with the Backend Transaction API which provides:

- Data persistence for wallet preferences
- Analytics and statistics

The frontend automatically syncs with the backend when a wallet is connected, creating or updating wallet records as needed.