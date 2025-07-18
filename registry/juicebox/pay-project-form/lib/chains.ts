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
  "0x000000000000000000000000000000000000eeee" as const;

export const JBSWAPTERMINAL_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xdd98b25631aa9372a8cf09912b803d2ad80db161",
  [optimism.id]: "0xf7002a2df9bebf629b6093c8a60e28beed4f7b48",
  [arbitrum.id]: "0xcf50c6f3f366817815fe7ba69b4518356ba6033b",
  [base.id]: "0x9b82f7f43a956f5e83faaf1d46382cba19ce71ab",
  [sepolia.id]: "0x94c5431808ab538d398c6354d1972a0cb8c0b18b",
  [optimismSepolia.id]: "0xb940f0bb31376cad3a0fae7c78995ae899160a52",
  [arbitrumSepolia.id]: "0xcf5f58ebb455678005b7dc6e506a7ec9a3438d0e",
  [baseSepolia.id]: "0xb940f0bb31376cad3a0fae7c78995ae899160a52",
} as const;

// JBPrices contract (price oracle) - same address across chains
export const JBPRICES_ADDRESS =
  "0xe712d14b04f1a1fe464be930e3ea72b9b0a141d7" as const;

// Supported tokens for swap terminal
export const SUPPORTED_TOKENS: Record<number, Record<string, `0x${string}`>> = {
  // Ethereum Mainnet
  [mainnet.id]: {
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  // Arbitrum Mainnet
  [arbitrum.id]: {
    DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    USDC: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    USDT: "0xfd086bc7cdc5c481dcc9c85ebe478a1c0b69fcbb9",
  },
  // Optimism Mainnet
  [optimism.id]: {
    DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    USDC: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    USDT: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
  },
  // Base Mainnet
  [base.id]: {
    USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
  // Ethereum Sepolia
  [sepolia.id]: {
    USDC: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  },
  // Base Sepolia
  [baseSepolia.id]: {
    USDC: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
  },
  // Optimism Sepolia
  [optimismSepolia.id]: {
    USDC: "0x5fd84259d66cd46123540766be93dfe6d43130d7",
  },
  // Arbitrum Sepolia
  [arbitrumSepolia.id]: {
    USDC: "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d",
  },
} as const;

export interface Currency {
  symbol: string;
  address: `0x${string}`;
  isNative: boolean;
}
