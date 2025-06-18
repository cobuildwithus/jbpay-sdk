"use client";

import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

interface Props {
  chainId: number;
}

export function ChainBalance(props: Props) {
  const { chainId } = props;

  const { address } = useAccount();
  const { data: balance } = useBalance({ chainId, address });

  if (!address) return "0.00";
  if (!balance) return "?.??";

  return Number(formatEther(balance.value)).toFixed(4);
}
