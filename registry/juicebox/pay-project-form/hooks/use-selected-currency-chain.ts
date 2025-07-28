"use client";

import {
  ETH_ADDRESS,
  type Currency,
} from "@/registry/juicebox/common/lib/juicebox-chains";
import { useAvailableChains } from "@/registry/juicebox/pay-project-form/hooks/use-available-chains";
import { useAvailableCurrencies } from "@/registry/juicebox/pay-project-form/hooks/use-available-currencies";
import { useDefaultChain } from "@/registry/juicebox/pay-project-form/hooks/use-default-chain";
import { useCurrentProject } from "@/registry/juicebox/pay-project-form/hooks/use-current-project";
import { useEffect, useState } from "react";
import { Chain } from "viem";
import { useAccount, useBalance } from "wagmi";

const HARDCODED_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

/**
 * Hook that manages the selected currency and chain state for the pay project form.
 * Handles the complex interactions between project selection, chain availability,
 * and currency options based on the selected project's configuration.
 */
export function useSelectedCurrencyChain() {
  const { address } = useAccount();
  const defaultChain = useDefaultChain();

  const [projectId, setProjectId] = useState(HARDCODED_PROJECT_ID || "3");
  const [selectedChain, setSelectedChain] = useState<Chain>(defaultChain);

  const { project, projects } = useCurrentProject(projectId, selectedChain.id);

  const availableChains = useAvailableChains(projects);
  const availableCurrencies = useAvailableCurrencies(selectedChain, project);

  // Initialize with the native currency of the default chain
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
    symbol: defaultChain.nativeCurrency.symbol,
    address: ETH_ADDRESS,
    isNative: true,
  });

  // Auto-reset to native currency when switching chains
  // This prevents invalid currency selections when moving between chains
  useEffect(() => {
    setSelectedCurrency({
      symbol: selectedChain.nativeCurrency.symbol,
      address: ETH_ADDRESS,
      isNative: true,
    });
  }, [selectedChain]);

  // Auto-correct chain selection if current chain becomes unavailable
  // This can happen when switching projects or when project data loads
  useEffect(() => {
    if (
      availableChains.length > 0 &&
      !availableChains.find((chain) => chain.id === selectedChain.id)
    ) {
      setSelectedChain(availableChains[0]);
    }
  }, [availableChains, selectedChain]);

  // Auto-correct currency selection if current currency becomes unavailable
  // This ensures the selected currency is always valid for the current context
  useEffect(() => {
    if (
      !availableCurrencies.find((c) => c.address === selectedCurrency.address)
    ) {
      setSelectedCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies, selectedCurrency.address]);

  const { data: balance } = useBalance({
    chainId: selectedChain.id,
    address,
    token: selectedCurrency.isNative ? undefined : selectedCurrency.address,
  });

  return {
    projectId,
    project,
    selectedChain,
    setSelectedChain,
    setProjectId,
    selectedCurrency,
    setSelectedCurrency,
    projects,
    balance,
  };
}
