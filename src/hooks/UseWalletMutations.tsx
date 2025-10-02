import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWallet, updateWallet, pingWallet } from "@/lib/api/wallets/api"
import { WalletBackendPayload } from "@/lib/types/wallet";

export const UseCreateWalletMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: WalletBackendPayload) => createWallet(data),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["wallet", variables.publicKey], data 
            );
        },
        onError: ( err) => {
            console.error("Failed to create wallet", err.message)
        }
    })

}

export const UseUpdateWalletMutation = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({publicKey, data}:
            {publicKey:string, data: WalletBackendPayload}) => updateWallet(publicKey, data),
            onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: ["wallet", variables.publicKey]
            })
            console.log("✅ Wallet updated successfully:", variables.publicKey);
            },
            onError: (error: Error) => {
            console.error("❌ Failed to update wallet:", error.message);
            }, 

            })
}

export const UsePingWalletMutation = () => {
  return useMutation({
    mutationFn: (publicKey: string) => pingWallet(publicKey),
    
    onSuccess: (publicKey) => {
      console.log("✅ Wallet pinged successfully:", publicKey);
    },
    
    onError: (error: Error) => {
      console.error("❌ Failed to ping wallet:", error.message);
    },
  });
};

