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

// Supported tokens for swap terminal
export const SUPPORTED_TOKENS: Record<number, Record<string, `0x${string}`>> = {
  // Ethereum Mainnet
  [mainnet.id]: {
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  // Arbitrum Mainnet
  [arbitrum.id]: {
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  },
  // Optimism Mainnet
  [optimism.id]: {
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  },
  // Base Mainnet
  [base.id]: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  // Ethereum Sepolia
  [sepolia.id]: {
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  // Base Sepolia
  [baseSepolia.id]: {
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  // Optimism Sepolia
  [optimismSepolia.id]: {
    USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  },
  // Arbitrum Sepolia
  [arbitrumSepolia.id]: {
    USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  },
} as const;

export interface Currency {
  symbol: string;
  address: `0x${string}`;
  isNative: boolean;
}
