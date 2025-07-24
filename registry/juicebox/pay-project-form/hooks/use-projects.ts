"use client";

import { API_URL } from "@/registry/juicebox/common/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Project {
  chainId: number;
  projectId: number;
  name: string;
  tagline: string;
  token: {
    name: string;
    symbol: string;
    address: string;
    price: string;
    disclosure: string;
  };
  suckerGroupId: string;
  isRevnet: boolean;
  accountingToken: `0x${string}`;
  accountingDecimals: number;
  accountingCurrency: number;
  accountingTokenSymbol: string;
  accountingTokenName: string;
}

export const useProjects = (args: {
  chainId: number;
  projectId: number | string;
  enabled?: boolean;
}) => {
  const { chainId, projectId, enabled = true } = args;
  return useQuery({
    queryKey: ["projects", chainId, projectId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/project/${chainId}/${projectId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<Project[]>;
    },
    // Only fire if both chainId and projectId are set
    enabled: enabled && chainId > 0 && Number(projectId) > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
