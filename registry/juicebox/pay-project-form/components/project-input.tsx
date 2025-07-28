"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import revnetIcon from "@/registry/juicebox/common/images/revnet.svg";
import {
  formatProjectInput,
  parseProjectInput,
} from "@/registry/juicebox/common/lib/juicebox-chains";
import { type Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type Chain } from "viem";

export function ProjectInput(props: {
  selectedChain: Chain;
  project: Project | null;
  projectId: string;
  setSelectedChain: (chain: Chain) => void;
  setProjectId: (projectId: string) => void;
}) {
  const { selectedChain, project, projectId, setSelectedChain, setProjectId } =
    props;

  // Track the formatted project input value (e.g., "base:3") separately from the parsed values
  // This allows users to freely edit the input while maintaining proper formatting
  const [inputValue, setInputValue] = useState(() =>
    formatProjectInput(selectedChain, projectId)
  );

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
      setProjectId(parsedProjectId);
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
              <Image
                src={revnetIcon}
                alt="Revnet"
                width={16}
                height={16}
                className="inline-block"
              />
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
