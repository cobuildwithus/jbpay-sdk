"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";
import { jbMultiTerminalAbi } from "@/registry/juicebox/pay-project-form/lib/abis";
import {
  ETH_ADDRESS,
  JBMULTITERMINAL_ADDRESS,
} from "@/registry/juicebox/pay-project-form/lib/chains";

interface Args {
  projectId: bigint;
  token: `0x${string}`;
  amount: string;
  beneficiary: `0x${string}`;
  minReturnedTokens?: bigint;
}

export type Status = "idle" | "connecting" | "pending" | "confirming" | "success" | "error";

export function usePayProject(chainId: number) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { chainId: connectedChainId, isConnected, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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
      return;
    }

    if (error) {
      setStatus("error");
      setErrorMessage((error as BaseError).shortMessage || error.message);
    }
  }, [isPending, isConfirming, isSuccess, hash, error]);

  const payProject = async (args: Args) => {
    try {
      setStatus("connecting");
      setErrorMessage("");

      if (!isConnected) {
        setStatus("error");
        setErrorMessage("Wallet not connected");
        return;
      }

      if (!address) {
        setStatus("error");
        setErrorMessage("No wallet address found");
        return;
      }

      if (chainId !== connectedChainId) {
        try {
          await switchChainAsync({ chainId });
        } catch (e) {
          setStatus("error");
          setErrorMessage(`Please switch to network ${chainId}`);
          return;
        }
      }

      const { projectId, token, amount, beneficiary, minReturnedTokens = 0n } = args;

      const isETH = token === ETH_ADDRESS;
      const value = isETH ? parseEther(amount) : 0n;
      const payAmount = isETH ? value : parseEther(amount);

      const memo = "";
      const metadata = "0x0" as `0x${string}`;

      writeContract({
        address: JBMULTITERMINAL_ADDRESS,
        abi: jbMultiTerminalAbi,
        functionName: "pay",
        args: [projectId, token, payAmount, beneficiary, minReturnedTokens, memo, metadata],
        value,
      });
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : (e as any).shortMessage || "Unknown error");
    }
  };

  return {
    status,
    errorMessage,
    hash,
    payProject,
    reset: () => {
      setStatus("idle");
      setErrorMessage("");
    },
  };
}
