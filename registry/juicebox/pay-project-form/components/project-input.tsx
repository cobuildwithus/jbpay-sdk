"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatProjectInput,
  parseProjectInput,
} from "@/registry/juicebox/common/lib/juicebox-chains";
import { type Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { useEffect, useState } from "react";
import { type Chain } from "viem";

export function ProjectInput(props: {
  selectedChain: Chain;
  project: Project | null;
  projectId: number;
  setSelectedChain: (chain: Chain) => void;
  setProjectId: (projectId: number) => void;
}) {
  const { selectedChain, project, projectId, setSelectedChain, setProjectId } = props;

  // Track the formatted project input value (e.g., "base:3") separately from the parsed values
  // This allows users to freely edit the input while maintaining proper formatting
  const [inputValue, setInputValue] = useState(() => formatProjectInput(selectedChain, projectId));

  // Keep the input field synchronized with the selected chain and project ID
  // This ensures the display stays consistent when chain is changed via dropdown
  useEffect(() => {
    if (projectId) {
      const formatted = formatProjectInput(selectedChain, projectId);
      setInputValue(formatted);
    }
  }, [selectedChain, projectId]);

  const handleProjectInputChange = (value: string) => {
    setInputValue(value);
    const { chain, projectId: parsedProjectId } = parseProjectInput(value);

    // Only update if we have a valid chain and projectId
    if (chain && parsedProjectId) {
      setSelectedChain(chain);
      setProjectId(Number(parsedProjectId));
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between space-x-2.5">
          <Label htmlFor="projectId" className="text-sm font-medium">
            Project
          </Label>
          <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
            {project?.name}
            {project?.isRevnet && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 288 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block size-4"
              >
                <path
                  d="M287.451 69.6339L173.138 0.0389404L150.509 58.7621L54.0338 0.0389404L0.246094 139.618L142.096 80.5446L119.35 139.618L287.451 69.6339Z"
                  fill="black"
                />
              </svg>
            )}
          </span>
        </div>
        <Input
          id="projectId"
          placeholder="chain:projectId (e.g. base:3)"
          value={inputValue}
          onChange={(e) => handleProjectInputChange(e.target.value)}
          className="h-12"
        />
      </div>
    </>
  );
}
