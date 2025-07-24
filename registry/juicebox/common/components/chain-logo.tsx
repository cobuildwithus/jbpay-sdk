import { cn } from "@/lib/utils";
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

interface Props {
  chainId: number;
  className?: string;
}

export function ChainLogo(props: Props) {
  const { chainId, className } = props;

  const logo = logos[chainId];
  if (!logo) return null;

  return <img src={logo} alt={chainId.toString()} className={cn("size-4 shrink-0", className)} />;
}

const logos: Record<Chain["id"], string> = {
  [mainnet.id]: "https://juicebox.money/assets/images/chain-logos/mainnet.svg",
  [base.id]: "https://juicebox.money/assets/images/chain-logos/base.svg",
  [optimism.id]: "https://juicebox.money/assets/images/chain-logos/optimism.svg",
  [arbitrum.id]: "https://juicebox.money/assets/images/chain-logos/arbitrum.svg",
  [baseSepolia.id]: "https://juicebox.money/assets/images/chain-logos/base.svg",
  [sepolia.id]: "https://juicebox.money/assets/images/chain-logos/mainnet.svg",
  [optimismSepolia.id]: "https://juicebox.money/assets/images/chain-logos/optimism.svg",
  [arbitrumSepolia.id]: "https://juicebox.money/assets/images/chain-logos/arbitrum.svg",
};
