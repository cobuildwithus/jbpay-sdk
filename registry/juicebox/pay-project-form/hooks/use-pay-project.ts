"use client";

import { jbMultiTerminalAbi, jbSwapTerminalAbi } from "@/registry/juicebox/common/lib/abis";
import {
  ETH_ADDRESS,
  JBSWAPTERMINAL_ADDRESS,
  type Currency,
} from "@/registry/juicebox/common/lib/chains";
import { useEffect, useState } from "react";
import { parseEther, parseUnits, zeroAddress } from "viem";
import { useWaitForTransactionReceipt, useWriteContract, type BaseError } from "wagmi";
import { useNormalizeAmount } from "./use-normalize-amount";
import { usePrepareWallet } from "./use-prepare-wallet";
import { usePrimaryTerminal } from "./use-primary-terminal";
import { Project } from "./use-projects";
import { useTokenAllowance } from "./use-token-allowance";
import { Status } from "./use-transaction-status";

interface Args {
  projectId: bigint;
  amount: string;
  beneficiary: `0x${string}`;
  minReturnedTokens?: bigint;
  currency: Currency;
  accountingToken: `0x${string}`;
  accountingDecimals: number;
}

export function usePayProject(project: Project, amount: string, paymentToken: `0x${string}`) {
  const { chainId, projectId } = project;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { prepareWallet } = usePrepareWallet();
  const { data: primaryTerminal } = usePrimaryTerminal(chainId, BigInt(projectId), paymentToken);

  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { approveToken, needsApproval, approvalHash } = useTokenAllowance(
    project,
    amount,
    { setStatus, setErrorMessage },
    primaryTerminal
  );

  const { normalizeAmount } = useNormalizeAmount(chainId);

  // Sync payment transaction state to status
  useEffect(() => {
    if (isPending) {
      setStatus("pending");
      return;
    }

    if (isConfirming && hash) {
      setStatus("confirming");
      return;
    }

    if (isSuccess && hash) {
      setStatus("success");
    }
  }, [isPending, isConfirming, isSuccess, hash]);

  // Handle payment transaction errors
  useEffect(() => {
    if (error) {
      setStatus("error");
      setErrorMessage((error as BaseError).shortMessage || error.message);
    }
  }, [error]);

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
        amount,
        beneficiary,
        minReturnedTokens = 0n,
        currency,
        accountingToken,
        accountingDecimals,
      } = args;

      const isPayingEth = currency.address === ETH_ADDRESS;
      const memo = "";
      const metadata = "0x0" as `0x${string}`;

      const hasPrimaryTerminal = !!primaryTerminal && primaryTerminal !== zeroAddress;

      if (hasPrimaryTerminal) {
        // Native token payment through multi-terminal
        const value = isPayingEth ? parseEther(amount) : 0n;

        writeContract({
          address: primaryTerminal,
          abi: jbMultiTerminalAbi,
          functionName: "pay",
          args: [
            projectId,
            accountingToken,
            parseUnits(amount, accountingDecimals),
            beneficiary,
            minReturnedTokens,
            memo,
            metadata,
          ],
          value,
          chainId,
        });
      } else {
        // Try to fall back to the swap terminal

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
            currency.address,
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
      setErrorMessage(e instanceof Error ? e.message : (e as any).shortMessage || "Unknown error");
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
      setErrorMessage(e instanceof Error ? e.message : "Failed to approve token");
    }
  };

  return {
    status,
    errorMessage,
    hash,
    approvalHash,
    payProject,
    approveToken: handleApproveToken,
    needsApproval,
    reset: () => {
      setStatus("idle");
      setErrorMessage("");
    },
  };
}
