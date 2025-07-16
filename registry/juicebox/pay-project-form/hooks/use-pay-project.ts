"use client";

import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  jbMultiTerminalAbi,
  jbSwapTerminalAbi,
} from "@/registry/juicebox/pay-project-form/lib/abis";
import {
  ETH_ADDRESS,
  JBMULTITERMINAL_ADDRESS,
  JBSWAPTERMINAL_ADDRESS,
  type Currency,
} from "@/registry/juicebox/pay-project-form/lib/chains";
import { usePrimaryNativeTerminal } from "./use-primary-terminal";
import { useTokenAllowance } from "./use-token-allowance";
import { useNormalizeAmount } from "./use-normalize-amount";
import { usePrepareWallet } from "./use-prepare-wallet";
import { useTransactionStatus } from "./use-transaction-status";

interface Args {
  projectId: bigint;
  token: `0x${string}`;
  amount: string;
  beneficiary: `0x${string}`;
  minReturnedTokens?: bigint;
  currency: Currency;
}

export function usePayProject(chainId: number, projectId: bigint) {
  const { prepareWallet } = usePrepareWallet();
  const { data: primaryTerminal } = usePrimaryNativeTerminal(
    chainId,
    projectId
  );
  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Use helper hooks
  const {
    checkAllowance,
    approveToken,
    needsApproval,
    setNeedsApproval,
    approvalHash,
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalError,
  } = useTokenAllowance(chainId);
  const { normalizeAmount } = useNormalizeAmount(chainId);

  // Use transaction status hook
  const {
    status,
    errorMessage,
    setStatus,
    setErrorMessage,
    reset: resetStatus,
  } = useTransactionStatus({
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: error || undefined,
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalHash,
    approvalError: approvalError || undefined,
    onApprovalSuccess: () => setNeedsApproval(false),
  });

  const payProject = async (args: Args) => {
    try {
      setStatus("connecting");
      setErrorMessage("");

      // Prepare wallet and switch chain if needed
      const walletResult = await prepareWallet(chainId);
      if (!walletResult.success) {
        setStatus("error");
        setErrorMessage(walletResult.error);
        return;
      }

      const {
        projectId,
        token,
        amount,
        beneficiary,
        minReturnedTokens = 0n,
        currency,
      } = args;

      const isETH = currency.isNative;
      const memo = "";
      const metadata = "0x0" as `0x${string}`;

      // Check allowance for ERC20 tokens
      if (!isETH) {
        const hasAllowance = await checkAllowance(token, amount, isETH);
        if (!hasAllowance) {
          setNeedsApproval(true);
          setStatus("error");
          setErrorMessage("Token approval required");
          return;
        }
      }

      if (isETH) {
        // Native token payment through multi-terminal
        const value = parseEther(amount);

        writeContract({
          address: primaryTerminal ?? JBMULTITERMINAL_ADDRESS,
          abi: jbMultiTerminalAbi,
          functionName: "pay",
          args: [
            projectId,
            ETH_ADDRESS,
            value,
            beneficiary,
            minReturnedTokens,
            memo,
            metadata,
          ],
          value,
          chainId,
        });
      } else {
        // ERC20 token payment through swap terminal
        const swapTerminal = JBSWAPTERMINAL_ADDRESS[chainId];

        if (!swapTerminal) {
          setStatus("error");
          setErrorMessage("Swap terminal not available on this network");
          return;
        }

        // Normalize amount based on token decimals
        const payAmount = await normalizeAmount(amount, currency);

        writeContract({
          address: swapTerminal,
          abi: jbSwapTerminalAbi,
          functionName: "pay",
          args: [
            projectId,
            token,
            payAmount,
            beneficiary,
            minReturnedTokens,
            memo,
            metadata,
          ],
          value: 0n,
          chainId,
        });
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMessage(
        e instanceof Error
          ? e.message
          : (e as any).shortMessage || "Unknown error"
      );
    }
  };

  const handleApproveToken = async (token: `0x${string}`, amount: string) => {
    try {
      setStatus("connecting");
      setErrorMessage("");

      // Prepare wallet and switch chain if needed
      const walletResult = await prepareWallet(chainId);
      if (!walletResult.success) {
        setStatus("error");
        setErrorMessage(walletResult.error);
        return;
      }

      // The status will be automatically updated by the useTransactionStatus hook
      await approveToken(token, amount);
    } catch (e) {
      setStatus("error");
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to approve token"
      );
    }
  };

  return {
    status,
    errorMessage,
    hash,
    approvalHash,
    payProject,
    approveToken: handleApproveToken,
    checkAllowance,
    needsApproval,
    reset: () => {
      resetStatus();
      setNeedsApproval(false);
    },
  };
}
