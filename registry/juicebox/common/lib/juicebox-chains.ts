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

export const JBMULTITERMINAL_ADDRESS = "0xdb9644369c79c3633cde70d2df50d827d7dc7dbc" as const;

export const JBDIRECTORY_ADDRESS = "0x0bc9f153dee4d3d474ce0903775b9b2aaae9aa41" as const;

export const ETH_ADDRESS = "0x000000000000000000000000000000000000eeee" as const;

export const FLOWS_ADDRESS = "0xa66c1faefd257dbe9da50e56c7816b5710c9e2a1" as const;

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
export const JBPRICES_ADDRESS = "0xe712d14b04f1a1fe464be930e3ea72b9b0a141d7" as const;

// Supported tokens for swap terminal
export const SUPPORTED_TOKENS: Record<number, Record<string, [`0x${string}`, number]>> = {
  // Ethereum Mainnet
  [mainnet.id]: {
    DAI: ["0x6b175474e89094c44da98b954eedeac495271d0f", 18],
    USDC: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 6],
    USDT: ["0xdac17f958d2ee523a2206206994597c13d831ec7", 6],
  },
  // Arbitrum Mainnet
  [arbitrum.id]: {
    DAI: ["0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", 18],
    USDC: ["0xaf88d065e77c8cc2239327c5edb3a432268e5831", 6],
    USDT: ["0xfd086bc7cdc5c481dcc9c85ebe478a1c0b69fcbb9", 6],
  },
  // Optimism Mainnet
  [optimism.id]: {
    DAI: ["0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", 18],
    USDC: ["0x0b2c639c533813f4aa9d7837caf62653d097ff85", 6],
    USDT: ["0x94b008aa00579c1307b0ef2c499ad98a8ce58e58", 6],
  },
  // Base Mainnet
  [base.id]: {
    USDC: ["0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", 6],
  },
  // Ethereum Sepolia
  [sepolia.id]: {
    USDC: ["0x1c7d4b196cb0c7b01d743fbc6116a902379c7238", 6],
  },
  // Base Sepolia
  [baseSepolia.id]: {
    USDC: ["0x036cbd53842c5426634e7929541ec2318f3dcf7e", 6],
  },
  // Optimism Sepolia
  [optimismSepolia.id]: {
    USDC: ["0x5fd84259d66cd46123540766be93dfe6d43130d7", 6],
  },
  // Arbitrum Sepolia
  [arbitrumSepolia.id]: {
    USDC: ["0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d", 6],
  },
} as const;

export interface Currency {
  symbol: string;
  address: `0x${string}`;
  isNative: boolean;
  decimals: number;
}

export function explorerUrl(chainId: number, address: string, type: "address" | "tx") {
  switch (chainId) {
    case mainnet.id:
      return `https://etherscan.io/${type}/${address}`;
    case optimism.id:
      return `https://optimistic.etherscan.io/${type}/${address}`;
    case arbitrum.id:
      return `https://arbiscan.io/${type}/${address}`;
    case base.id:
      return `https://basescan.org/${type}/${address}`;
    case sepolia.id:
      return `https://sepolia.etherscan.io/${type}/${address}`;
    case optimismSepolia.id:
      return `https://optimistic.etherscan.io/${type}/${address}`;
    case arbitrumSepolia.id:
      return `https://arbiscan.io/${type}/${address}`;
  }
}

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
  const entry = Object.entries(CHAIN_SHORTCUTS).find(([, c]) => c.id === chain.id);
  return entry ? (entry[0] as ChainShortcut) : null;
};

// Helper to parse the combined input
export const parseProjectInput = (input: string): { chain: Chain | null; projectId: string } => {
  const parts = input.split(":");
  if (parts.length !== 2) return { chain: null, projectId: "" };

  const [chainPart, projectIdPart] = parts;
  const chain = CHAIN_SHORTCUTS[chainPart as ChainShortcut] || null;
  return { chain, projectId: projectIdPart || "" };
};

// Helper to format the combined input
export const formatProjectInput = (chain: Chain, projectId: string | number): string => {
  const shortcut = getChainShortcut(chain);
  if (!shortcut) return "";
  return `${shortcut}:${projectId}`;
};

export function getChain(chainId: number) {
  switch (chainId) {
    case base.id:
      return base;
    case baseSepolia.id:
      return baseSepolia;
    case mainnet.id:
      return mainnet;
    case optimism.id:
      return optimism;
    case arbitrum.id:
      return arbitrum;
    case sepolia.id:
      return sepolia;
    case optimismSepolia.id:
      return optimismSepolia;
    case arbitrumSepolia.id:
      return arbitrumSepolia;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
