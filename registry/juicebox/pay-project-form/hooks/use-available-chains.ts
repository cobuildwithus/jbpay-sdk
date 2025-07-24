"use client";

import { jbChains } from "@/registry/juicebox/common/lib/juicebox-chains";
import { Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { useMemo } from "react";
import { type Chain } from "viem";

/**
 * Returns the list of chains that have a published configuration for the given set of projects.
 * If the projects list is empty or undefined, all Juicebox chains are returned.
 */
export function useAvailableChains(projects: Project[] | null | undefined): Chain[] {
  return useMemo(() => {
    if (!projects || projects.length === 0) return jbChains;

    const projectChainIds = projects.map((p) => p.chainId);
    return jbChains.filter((chain) => projectChainIds.includes(chain.id));
  }, [projects]);
}
