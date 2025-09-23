export interface WalletInfo {
    publicKey: string;
    network: string;
    balance: number;
}

export interface WalletUserPreferences {
  spamThreshold: number;   
  preferredTxLimit: number;
}

export interface WalletBackendPayload extends WalletInfo, WalletUserPreferences {

}