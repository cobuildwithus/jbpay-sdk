"use client";

import { useMemo } from "react";
import { Chain } from "viem";
import {
  ETH_ADDRESS,
  SUPPORTED_TOKENS,
  type Currency,
} from "@/registry/juicebox/pay-project-form/lib/chains";
import { Project } from "./use-projects";

/**
 * Returns list of currencies user can pay with for given chain + project.
 * Will:
 * 1. Include native currency (ETH, etc.) unless the project cannot accept it.
 * 2. Include chain-specific supported stablecoins.
 * 3. Include the project’s accounting token (if it differs from native).
 */
export function useAvailableCurrencies(
  selectedChain: Chain,
  project: Project | null | undefined
): Currency[] {
  return useMemo(() => {
    const currencies: Currency[] = [];

    // Whether project accepts native currency
    const disableNative =
      project?.accountingToken?.toLowerCase() !== ETH_ADDRESS.toLowerCase();

    // 1. Native currency
    if (!disableNative) {
      currencies.push({
        symbol: selectedChain.nativeCurrency.symbol,
        address: ETH_ADDRESS,
        isNative: true,
      });
    }

    // 2. Chain stablecoins
    const supported = SUPPORTED_TOKENS[selectedChain.id]
      ? Object.entries(SUPPORTED_TOKENS[selectedChain.id]).map(
          ([symbol, address]) => ({
            symbol,
            address,
            isNative: false,
          })
        )
      : [];
    currencies.push(...supported);

    // 3. Project accounting token
    if (project) {
      const accountingTokenAddr = project.accountingToken.toLowerCase();
      const alreadyIncluded = currencies.some(
        (c) => c.address.toLowerCase() === accountingTokenAddr
      );
      if (!alreadyIncluded) {
        currencies.push({
          symbol: project.accountingTokenSymbol,
          address: project.accountingToken,
          isNative: false,
        });
      }
    }

    console.log("currencies", currencies);

    return currencies;
  }, [selectedChain.id, project]);
}
