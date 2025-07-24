"use client";

import { API_URL } from "@/registry/juicebox/common/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface ActivityLogItem {
  id: string;
  chainId: number;
  timestamp: number;
  txHash: string;
  suckerGroupId: string;
  type: string; // "pay" | "borrow" | "repay" | "liquidate" | "reallocate" | "cashout"
  user: string;
  amount: string;
  currency: string;
  description: string;
  memo?: string;
  profile: {
    address: string;
    name: string;
    avatar: string | null;
    bio: string | null;
  };
}

export const useActivityLog = (args: {
  chainId: number;
  projectId: number | string;
  perPage?: number;
  enabled?: boolean;
}) => {
  const { chainId, projectId, enabled = true, perPage = 10 } = args;
  return useInfiniteQuery({
    queryKey: ["activity", chainId, projectId, perPage],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL(`${API_URL}/activity/${chainId}/${projectId}`);
      url.searchParams.set("limit", perPage.toString());
      url.searchParams.set("offset", pageParam.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<{
        activities: ActivityLogItem[];
        pagination: {
          limit: number;
          offset: number;
          total: number;
          hasMore: boolean;
        };
      }>;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: enabled && chainId > 0 && Number(projectId) > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
