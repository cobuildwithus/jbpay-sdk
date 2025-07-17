import { createPublicClient, http } from "viem";
import {
  base,
  baseSepolia,
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
  Chain,
} from "viem/chains";

// Helper to fetch Alchemy key
function getAlchemyKey() {
  return process.env.NEXT_PUBLIC_ALCHEMY_ID;
}

export function getRpcUrl(chain: Chain, type: "http" | "ws") {
  const alchemyId = getAlchemyKey();
  if (!alchemyId) throw new Error("Missing Alchemy env var");

  const protocol = type === "http" ? "https" : "wss";

  switch (chain.id) {
    case base.id:
      return `${protocol}://base-mainnet.g.alchemy.com/v2/${alchemyId}`;
    case baseSepolia.id:
      return `${protocol}://base-sepolia.g.alchemy.com/v2/${alchemyId}`;
    case mainnet.id:
      return `${protocol}://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    case optimism.id:
      return `${protocol}://opt-mainnet.g.alchemy.com/v2/${alchemyId}`;
    case arbitrum.id:
      return `${protocol}://arb-mainnet.g.alchemy.com/v2/${alchemyId}`;
    case sepolia.id:
      return `${protocol}://eth-sepolia.g.alchemy.com/v2/${alchemyId}`;
    case optimismSepolia.id:
      return `${protocol}://opt-sepolia.g.alchemy.com/v2/${alchemyId}`;
    case arbitrumSepolia.id:
      return `${protocol}://arb-sepolia.g.alchemy.com/v2/${alchemyId}`;
    default:
      throw new Error(`Unsupported chain: ${chain.id}`);
  }
}

function makeClient(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(getRpcUrl(chain, "http")),
    batch: { multicall: true },
  });
}

export const mainnetClient = makeClient(mainnet);
export const baseClient = makeClient(base);
export const optimismClient = makeClient(optimism);
export const arbitrumClient = makeClient(arbitrum);
export const sepoliaClient = makeClient(sepolia);
export const baseSepoliaClient = makeClient(baseSepolia);
export const optimismSepoliaClient = makeClient(optimismSepolia);
export const arbitrumSepoliaClient = makeClient(arbitrumSepolia);

export const getClient = (chainId: number) => {
  switch (chainId) {
    case base.id:
      return baseClient;
    case mainnet.id:
      return mainnetClient;
    case optimism.id:
      return optimismClient;
    case arbitrum.id:
      return arbitrumClient;
    case sepolia.id:
      return sepoliaClient;
    case baseSepolia.id:
      return baseSepoliaClient;
    case optimismSepolia.id:
      return optimismSepoliaClient;
    case arbitrumSepolia.id:
      return arbitrumSepoliaClient;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
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
