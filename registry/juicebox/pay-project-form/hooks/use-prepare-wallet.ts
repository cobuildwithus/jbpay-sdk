"use client";

import { useAccount, useSwitchChain } from "wagmi";

export type PrepareWalletResult = { success: true } | { success: false; error: string };

export function usePrepareWallet() {
  const { chainId: connectedChainId, isConnected, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const prepareWallet = async (targetChainId: number): Promise<PrepareWalletResult> => {
    // Check if wallet is connected
    if (!isConnected) {
      return { success: false, error: "Wallet not connected" };
    }

    // Check if address exists
    if (!address) {
      return { success: false, error: "No wallet address found" };
    }

    // Check if we need to switch chains
    if (targetChainId !== connectedChainId) {
      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (e) {
        return {
          success: false,
          error: `Please switch to network ${targetChainId}`,
        };
      }
    }

    return { success: true };
  };

  return {
    prepareWallet,
    isConnected,
    address,
    connectedChainId,
  };
}
