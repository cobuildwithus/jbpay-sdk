import { arbitrum, base, mainnet, optimism } from "viem/chains";
import { createConfig, fallback, http, injected } from "wagmi";

export const transports = {
  [mainnet.id]: fallback([
    ...(process.env.NEXT_PUBLIC_INFURA_ID
      ? [http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`)]
      : []),
    http(), // Public RPC fallback
  ]),
  [optimism.id]: fallback([
    ...(process.env.NEXT_PUBLIC_INFURA_ID
      ? [http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`)]
      : []),
    http(), // Public RPC fallback
  ]),
  [base.id]: fallback([
    ...(process.env.NEXT_PUBLIC_INFURA_ID
      ? [http(`https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`)]
      : []),
    http(), // Public RPC fallback
  ]),
  [arbitrum.id]: fallback([
    ...(process.env.NEXT_PUBLIC_INFURA_ID
      ? [http(`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`)]
      : []),
    http(), // Public RPC fallback
  ]),
};

export const wagmiConfig = createConfig({
  chains: [mainnet, optimism, arbitrum, base],
  connectors: [injected()],
  transports,
});
