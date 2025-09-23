import { ApiClient } from "../client";
import { WalletBackendPayload } from "@/lib/types/wallet";

export const createWallet = async (walletData: WalletBackendPayload) => {
    return await ApiClient.post("/wallets", walletData)
}

export const updateWallet = async (publicKey: string, walletDataUpdate: WalletBackendPayload) => {
    return ApiClient.patch(`/wallets/${publicKey}`, walletDataUpdate)
}

export const pingWallet = (publicKey:string) => {
    return ApiClient.put(`/wallets/${publicKey}/ping`);
}