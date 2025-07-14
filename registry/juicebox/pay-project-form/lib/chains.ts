import {
  arbitrum,
  base,
  Chain,
  mainnet,
  optimism,
  baseSepolia,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
} from "viem/chains";

export const jbChains = [
  base,
  mainnet,
  optimism,
  arbitrum,
  baseSepolia,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
] as const satisfies Chain[];

export const JBMULTITERMINAL_ADDRESS =
  "0xdb9644369c79c3633cde70d2df50d827d7dc7dbc" as const;

export const JBDIRECTORY_ADDRESS =
  "0x0bc9f153dee4d3d474ce0903775b9b2aaae9aa41" as const;

export const ETH_ADDRESS =
  "0x000000000000000000000000000000000000EEEe" as const;
