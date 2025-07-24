"use client";

import {
  ETH_ADDRESS,
  FLOWS_ADDRESS,
  SUPPORTED_TOKENS,
  type Currency,
} from "@/registry/juicebox/common/lib/juicebox-chains";
import { Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { useMemo } from "react";
import { type Chain } from "viem";

/**
 * Returns list of currencies user can pay with for given chain + project.
 * Will:
 * 1. Include native currency (ETH, etc.) unless the project cannot accept it.
 * 2. Include chain-specific supported stablecoins (only if accounting token is ETH).
 * 3. Include the project’s accounting token (if it differs from native).
 */
export function useAvailableCurrencies(
  selectedChain: Chain,
  project: Project | null | undefined
): Currency[] {
  return useMemo(() => {
    const currencies: Currency[] = [];

    // Check if the project's accounting token is the FLOWS token
    const isFlowsBacked = project
      ? project.accountingToken.toLowerCase() === FLOWS_ADDRESS.toLowerCase()
      : false;

    // Disable native currency if the project's accounting token is not ETH
    let disableNative = false;
    if (project) {
      disableNative = project.accountingToken.toLowerCase() !== ETH_ADDRESS.toLowerCase();
    }

    // If the project is FLOWS-backed, don't disable native currency
    // as we have the FlowsTerminal contract that handles the native currency swap
    if (isFlowsBacked) {
      disableNative = false;
    }

    // 1. Native currency
    if (!disableNative) {
      currencies.push({
        symbol: selectedChain.nativeCurrency.symbol,
        address: ETH_ADDRESS,
        isNative: true,
      });
    }

    // 2. Chain stablecoins (only if accounting token is ETH)
    const isAccountingTokenEth =
      !project || project.accountingToken.toLowerCase() === ETH_ADDRESS.toLowerCase();

    if (isAccountingTokenEth) {
      const supported = SUPPORTED_TOKENS[selectedChain.id]
        ? Object.entries(SUPPORTED_TOKENS[selectedChain.id]).map(([symbol, address]) => ({
            symbol,
            address,
            isNative: false,
          }))
        : [];
      currencies.push(...supported);
    }

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

    return currencies;
  }, [selectedChain.id, project]);
}
