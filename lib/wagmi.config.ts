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
import { createConfig, fallback, http, injected, Transport } from "wagmi";

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export const transports: Record<number, Transport> = {
  [mainnet.id]: fallback([
    ...(INFURA_ID ? [http(`https://mainnet.infura.io/v3/${INFURA_ID}`)] : []),
    http(),
  ]),
  [optimism.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://optimism-mainnet.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [base.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://base-mainnet.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [arbitrum.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [baseSepolia.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://base-sepolia.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [optimismSepolia.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://optimism-sepolia.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [arbitrumSepolia.id]: fallback([
    ...(INFURA_ID
      ? [http(`https://arbitrum-sepolia.infura.io/v3/${INFURA_ID}`)]
      : []),
    http(),
  ]),
  [sepolia.id]: fallback([
    ...(INFURA_ID ? [http(`https://sepolia.infura.io/v3/${INFURA_ID}`)] : []),
    http(),
  ]),
};

export const wagmiConfig = createConfig({
  chains: jbChains,
  connectors: [injected()],
  transports,
});
