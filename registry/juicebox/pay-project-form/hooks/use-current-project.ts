"use client";

import { useProjects } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { useMemo } from "react";

/**
 * Hook that fetches the current project for a given project ID and chain ID.
 */
export function useCurrentProject(projectId: string, chainId: number) {
  // Fetch project data for the current chain and project ID combination
  const { data: projects } = useProjects({
    chainId,
    projectId,
  });

  // Extract the specific project for the currently selected chain
  const project = useMemo(() => {
    if (!projects || projects.length === 0) return null;
    return projects.find((p) => p.chainId === chainId) || null;
  }, [projects, chainId]);

  return {
    project,
    projects,
  };
}
