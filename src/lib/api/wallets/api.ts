import { ApiClient } from "../client";
import { WalletBackendPayload } from "@/lib/types/wallet";

export const createWallet = async (walletData: WalletBackendPayload) => {
    return await ApiClient.post("/wallets", walletData)
}

export const updateWallet = async (publicKey: string, walletDataUpdate: WalletBackendPayload) => {
    return await ApiClient.patch(`/wallets/${publicKey}`, walletDataUpdate)
}

export const pingWallet = async (publicKey:string) => {
    return await  ApiClient.put(`/wallets/${publicKey}/ping`);
}

export const getWallet = async (publicKey:string) => {
    return await ApiClient.get(`/wallets/${publicKey}`);
}