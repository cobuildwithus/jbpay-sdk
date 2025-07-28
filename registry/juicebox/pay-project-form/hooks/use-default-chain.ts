"use client";

const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;

import { jbChains } from "@/registry/juicebox/common/lib/juicebox-chains";
import { useMemo } from "react";
import { base } from "viem/chains";

export function useDefaultChain() {
  // Find the default chain or use the first available chain
  const defaultChain = useMemo(() => {
    if (DEFAULT_CHAIN_ID) {
      const chainId = Number(DEFAULT_CHAIN_ID);
      const foundChain = jbChains.find((chain) => chain.id === chainId);
      if (foundChain) return foundChain;
    }
    return base; // Default to base
  }, []);

  return defaultChain;
}
