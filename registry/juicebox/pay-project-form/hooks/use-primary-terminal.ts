import { jbDirectoryAbi } from "@/registry/juicebox/common/lib/abis";
import { JBDIRECTORY_ADDRESS } from "@/registry/juicebox/common/lib/chains";
import { useReadContract } from "wagmi";

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
