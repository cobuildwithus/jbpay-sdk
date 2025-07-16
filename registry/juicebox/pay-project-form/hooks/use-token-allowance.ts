"use client";

import { useState } from "react";
import { erc20Abi } from "viem";
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { JBSWAPTERMINAL_ADDRESS } from "@/registry/juicebox/pay-project-form/lib/chains";
import { useNormalizeAmount } from "./use-normalize-amount";

export function useTokenAllowance(chainId: number) {
  const [needsApproval, setNeedsApproval] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId });
  const {
    writeContract,
    data: approvalHash,
    isPending: isApprovalPending,
    error: approvalError,
  } = useWriteContract();
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });
  const { normalizeAmount } = useNormalizeAmount(chainId);

  const checkAllowance = async (
    token: `0x${string}`,
    amount: string,
    isNative: boolean
  ): Promise<boolean> => {
    if (isNative || !address || !publicClient) return true;

    const swapTerminal = JBSWAPTERMINAL_ADDRESS[chainId];
    if (!swapTerminal) return false;

    try {
      // Normalize the amount first
      const normalizedAmount = await normalizeAmount(amount, {
        address: token,
        symbol: "",
        isNative: false,
      });

      // Read current allowance
      const allowance = await publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, swapTerminal],
      });

      const hasAllowance = allowance >= normalizedAmount;
      setNeedsApproval(!hasAllowance);
      return hasAllowance;
    } catch (e) {
      console.error("Error checking allowance:", e);
      return false;
    }
  };

  const approveToken = async (token: `0x${string}`, amount: string) => {
    const swapTerminal = JBSWAPTERMINAL_ADDRESS[chainId];
    if (!swapTerminal) {
      throw new Error("Swap terminal not available on this network");
    }

    try {
      // Normalize the amount based on token decimals
      const normalizedAmount = await normalizeAmount(amount, {
        address: token,
        symbol: "",
        isNative: false,
      });

      writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [swapTerminal, normalizedAmount],
        chainId,
      });
    } catch (e) {
      console.error("Error approving token:", e);
      throw e;
    }
  };

  return {
    checkAllowance,
    approveToken,
    needsApproval,
    setNeedsApproval,
    approvalHash,
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalError,
  };
}
