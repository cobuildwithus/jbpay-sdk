"use client";

import { useState, useEffect } from "react";
import { BaseError, erc20Abi, parseUnits } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { type Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { type Status } from "@/registry/juicebox/pay-project-form/hooks/use-transaction-status";

export function useTokenAllowance(
  project: Project,
  amount: string,
  callbacks: {
    setStatus: (status: Status) => void;
    setErrorMessage: (message: string) => void;
  },
  terminal?: `0x${string}`
) {
  const { chainId, accountingToken, accountingDecimals } = project;
  const { setStatus, setErrorMessage } = callbacks;
  const [needsApproval, setNeedsApproval] = useState(false);
  const { address } = useAccount();
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

  const { data: allowance } = useReadContract({
    address: accountingToken,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && terminal ? [address, terminal] : undefined,
    chainId,
  });

  useEffect(() => {
    const normalizedAmount = parseUnits(amount, accountingDecimals);

    if ((allowance || 0n) < normalizedAmount) {
      setNeedsApproval(true);
    }
  }, [allowance, amount]);

  const approveToken = async (token: `0x${string}`, amount: string) => {
    if (!terminal) return;

    try {
      // Normalize the amount based on token decimals
      const normalizedAmount = parseUnits(amount, accountingDecimals);

      writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [terminal, normalizedAmount],
        chainId,
      });
    } catch (e) {
      console.error("Error approving token:", e);
      throw e;
    }
  };

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

  return {
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
