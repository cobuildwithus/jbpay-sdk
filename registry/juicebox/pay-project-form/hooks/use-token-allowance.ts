"use client";

import { useState, useEffect } from "react";
import { erc20Abi } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { JBSWAPTERMINAL_ADDRESS } from "@/registry/juicebox/pay-project-form/lib/chains";
import { useNormalizeAmount } from "./use-normalize-amount";
import { Status } from "./use-transaction-status";
import { getClient } from "@/lib/client";

interface StatusCallbacks {
  setStatus?: (status: Status) => void;
  setErrorMessage?: (message: string) => void;
}

export function useTokenAllowance(
  chainId: number,
  callbacks: StatusCallbacks = {}
) {
  const { setStatus, setErrorMessage } = callbacks;
  const [needsApproval, setNeedsApproval] = useState(false);
  const { address } = useAccount();
  const publicClient = getClient(chainId);
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

  // Sync approval transaction state with provided callbacks
  useEffect(() => {
    if (isApprovalPending) {
      setStatus?.("pending");
      return;
    }

    if (isApprovalConfirming && approvalHash) {
      setStatus?.("confirming");
      return;
    }

    if (isApprovalSuccess && approvalHash) {
      setStatus?.("idle");
      // Approval succeeded, allowance accounted for
      setNeedsApproval(false);
      return;
    }

    if (approvalError) {
      setStatus?.("error");
      setErrorMessage?.(
        (approvalError as BaseError).shortMessage || approvalError.message
      );
    }
  }, [
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalHash,
    approvalError,
    setStatus,
    setErrorMessage,
  ]);

  const checkAllowance = async (
    token: `0x${string}`,
    amount: string,
    isNative: boolean
  ): Promise<boolean> => {
    if (isNative || !address) return true;

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
