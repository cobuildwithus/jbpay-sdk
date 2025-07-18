import { useReadContract } from "wagmi";
import { JBDIRECTORY_ADDRESS } from "../lib/chains";
import { jbDirectoryAbi } from "../lib/abis";

export function usePrimaryTerminal(
  chainId: number,
  projectId: bigint,
  paymentToken: `0x${string}`
) {
  const result = useReadContract({
    address: JBDIRECTORY_ADDRESS,
    abi: jbDirectoryAbi,
    functionName: "primaryTerminalOf",
    args: [projectId, paymentToken],
    chainId,
  });

  return result;
}
