"use client";

import { getClient } from "@/lib/client";
import { type Currency } from "@/registry/juicebox/common/lib/chains";
import { erc20Abi, parseEther, parseUnits } from "viem";

export function useNormalizeAmount(chainId: number) {
  const publicClient = getClient(chainId);

  const normalizeAmount = async (amount: string, currency: Currency): Promise<bigint> => {
    if (currency.isNative) {
      // Native tokens always use 18 decimals
      return parseEther(amount);
    }

    try {
      // Read token decimals from the contract
      const decimals = await publicClient.readContract({
        address: currency.address,
        abi: erc20Abi,
        functionName: "decimals",
      });

      // Parse the amount with the correct decimals
      return parseUnits(amount, Number(decimals));
    } catch (e) {
      console.error("Error reading token decimals:", e);
      // Fallback to 18 decimals if reading fails
      return parseEther(amount);
    }
  };

  return { normalizeAmount };
}
