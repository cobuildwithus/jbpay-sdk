import { useReadContract } from "wagmi";
import { JBDIRECTORY_ADDRESS, ETH_ADDRESS } from "../lib/chains";
import { jbDirectoryAbi } from "../lib/abis";

export function usePrimaryNativeTerminal(chainId: number, projectId: bigint) {
  const result = useReadContract({
    address: JBDIRECTORY_ADDRESS,
    abi: jbDirectoryAbi,
    functionName: "primaryTerminalOf",
    args: [projectId, ETH_ADDRESS],
    chainId,
  });

  return result;
}
