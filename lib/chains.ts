import { Chain } from "viem";
import {
  mainnet,
  base,
  optimism,
  arbitrum,
  baseSepolia,
  optimismSepolia,
  sepolia,
  arbitrumSepolia,
} from "viem/chains";

export const CHAIN_SHORTCUTS = {
  eth: mainnet,
  base: base,
  op: optimism,
  arb: arbitrum,
  sep: sepolia,
  opsep: optimismSepolia,
  basesep: baseSepolia,
  arbsep: arbitrumSepolia,
} as const;

export type ChainShortcut = keyof typeof CHAIN_SHORTCUTS;

// Reverse mapping for getting shortcut from chain
export const getChainShortcut = (chain: Chain): ChainShortcut | null => {
  const entry = Object.entries(CHAIN_SHORTCUTS).find(
    ([, c]) => c.id === chain.id
  );
  return entry ? (entry[0] as ChainShortcut) : null;
};

// Helper to parse the combined input
export const parseProjectInput = (
  input: string
): { chain: Chain | null; projectId: string } => {
  const parts = input.split(":");
  if (parts.length !== 2) return { chain: null, projectId: "" };

  const [chainPart, projectIdPart] = parts;
  const chain = CHAIN_SHORTCUTS[chainPart as ChainShortcut] || null;
  return { chain, projectId: projectIdPart || "" };
};

// Helper to format the combined input
export const formatProjectInput = (chain: Chain, projectId: string): string => {
  const shortcut = getChainShortcut(chain);
  if (!shortcut) return "";
  return `${shortcut}:${projectId}`;
};
