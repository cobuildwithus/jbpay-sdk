import { jbChains } from "@/registry/juicebox/common/lib/juicebox-chains";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  Chain,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { createConfig, http, injected, Transport } from "wagmi";

export const transports: Record<number, Transport> = {
  [mainnet.id]: http(getRpcUrl(mainnet, "http")),
  [optimism.id]: http(getRpcUrl(optimism, "http")),
  [base.id]: http(getRpcUrl(base, "http")),
  [arbitrum.id]: http(getRpcUrl(arbitrum, "http")),
  [baseSepolia.id]: http(getRpcUrl(baseSepolia, "http")),
  [optimismSepolia.id]: http(getRpcUrl(optimismSepolia, "http")),
  [arbitrumSepolia.id]: http(getRpcUrl(arbitrumSepolia, "http")),
  [sepolia.id]: http(getRpcUrl(sepolia, "http")),
};

export const wagmiConfig = createConfig({
  chains: jbChains,
  connectors: [injected()],
  transports,
});

function getRpcUrl(chain: Chain, type: "http" | "ws") {
  const infuraId = getInfuraKey();
  if (!infuraId) throw new Error("Missing Infura env var");

  const protocol = type === "http" ? "https" : "wss";

  switch (chain.id) {
    case mainnet.id:
      return `${protocol}://mainnet.infura.io/v3/${infuraId}`;
    case optimism.id:
      return `${protocol}://optimism-mainnet.infura.io/v3/${infuraId}`;
    case base.id:
      return `${protocol}://base-mainnet.infura.io/v3/${infuraId}`;
    case arbitrum.id:
      return `${protocol}://arbitrum-mainnet.infura.io/v3/${infuraId}`;
    case sepolia.id:
      return `${protocol}://sepolia.infura.io/v3/${infuraId}`;
    case baseSepolia.id:
      return `${protocol}://base-sepolia.infura.io/v3/${infuraId}`;
    case optimismSepolia.id:
      return `${protocol}://optimism-sepolia.infura.io/v3/${infuraId}`;
    case arbitrumSepolia.id:
      return `${protocol}://arbitrum-sepolia.infura.io/v3/${infuraId}`;
    default:
      throw new Error(`Unsupported chain: ${chain.id}`);
  }
}
function getInfuraKey() {
  return process.env.NEXT_PUBLIC_INFURA_ID;
}
