"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionConfirmationModal } from "@/registry/juicebox/pay-project-form/components/confirm-transaction";
import { ConnectButton } from "@/registry/juicebox/pay-project-form/components/connect-button";
import { SelectChain } from "@/registry/juicebox/pay-project-form/components/select-chain";
import { useProject } from "@/registry/juicebox/pay-project-form/hooks/use-project";
import { jbChains } from "@/registry/juicebox/pay-project-form/lib/chains";
import { calculateTokensFromEth } from "@/registry/juicebox/pay-project-form/lib/quote";
import { useEffect, useState } from "react";
import { Chain, formatEther } from "viem";
import { mainnet } from "viem/chains";
import { useAccount, useBalance } from "wagmi";

export function PayProjectForm() {
  const [projectId, setProjectId] = useState("");
  const [selectedChain, setSelectedChain] = useState<Chain>(jbChains[0]);
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChainPopover, setShowChainPopover] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);

  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ chainId: selectedChain.id, address });

  const { data: project } = useProject({ chainId: selectedChain.id, projectId });

  useEffect(() => {
    setShowConnectButton(!isConnected);
  }, [isConnected]);

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between space-x-2.5">
              <Label htmlFor="projectId" className="text-sm font-medium">
                Project ID
              </Label>
              <span className="text-xs text-muted-foreground truncate">{project?.name}</span>
            </div>
            <Input
              id="projectId"
              placeholder="Enter project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              You Pay
            </Label>
            <div className="border border-border rounded-lg p-2 space-y-3">
              <SelectChain
                selectedChain={selectedChain}
                onSelect={(chain) => {
                  setSelectedChain(chain);
                  setShowChainPopover(false);
                }}
                isOpen={showChainPopover}
                onOpenChange={setShowChainPopover}
              />

              <div className="relative">
                <Input
                  id="amount"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pr-16 md:text-2xl border-0 bg-transparent pl-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  step="0.001"
                  min={0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const amount = Number(formatEther(balance?.value ?? 0n));
                    const gasBuffer = selectedChain.id === mainnet.id ? 0.01 : 0.0025;
                    setAmount(Math.max(amount - gasBuffer, 0).toFixed(5));
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20"
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {showConnectButton ? (
            <ConnectButton className="w-full h-12 text-lg font-medium" size="lg" />
          ) : (
            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={Number(amount) <= 0 || !project}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              Pay {amount || "0"} {selectedChain.nativeCurrency.symbol}
            </Button>
          )}

          <div
            className={`text-center text-sm text-muted-foreground transition-opacity duration-300 -mt-2.5 ${
              project && amount && Number.parseFloat(amount) > 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            You'll receive ~{calculateTokensFromEth(amount, project?.token.price || "0")}{" "}
            {project?.token.symbol}
          </div>
        </CardContent>
      </Card>

      {project && (
        <TransactionConfirmationModal
          isOpen={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          amount={amount}
          chain={selectedChain}
          project={project}
        />
      )}
    </>
  );
}
