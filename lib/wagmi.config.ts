import { jbChains } from "@/registry/juicebox/pay-project-form/lib/chains";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { createConfig, http, injected, Transport } from "wagmi";
import { getRpcUrl } from "@/lib/client";

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
