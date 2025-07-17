"use client";

import { parseEther, parseUnits, erc20Abi } from "viem";
import { type Currency } from "@/registry/juicebox/pay-project-form/lib/chains";
import { getClient } from "@/lib/client";

export function useNormalizeAmount(chainId: number) {
  const publicClient = getClient(chainId);

  const normalizeAmount = async (
    amount: string,
    currency: Currency
  ): Promise<bigint> => {
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
