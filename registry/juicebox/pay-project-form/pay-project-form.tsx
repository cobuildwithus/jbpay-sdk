"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConnectButton } from "@/registry/juicebox/common/components/connect-button";
import { TransactionConfirmationModal } from "@/registry/juicebox/pay-project-form/components/confirm-transaction";
import { SelectCurrency } from "@/registry/juicebox/pay-project-form/components/select-currency";
import { useSelectedCurrencyChain } from "@/registry/juicebox/pay-project-form/hooks/use-selected-currency-chain";
import { TokensReceived } from "@/registry/juicebox/pay-project-form/components/tokens-received";
import { ProjectInput } from "@/registry/juicebox/pay-project-form/components/project-input";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { mainnet } from "viem/chains";
import { useAccount } from "wagmi";

// Optional environment variables
const HARDCODED_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

export function PayProjectForm() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);

  const {
    projectId,
    project,
    selectedChain,
    setSelectedChain,
    setProjectId,
    selectedCurrency,
    setSelectedCurrency,
    balance,
  } = useSelectedCurrencyChain();

  useEffect(() => {
    setShowConnectButton(!isConnected);
  }, [isConnected]);

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          {!HARDCODED_PROJECT_ID && (
            <ProjectInput
              selectedChain={selectedChain}
              project={project}
              projectId={projectId}
              setSelectedChain={setSelectedChain}
              setProjectId={setProjectId}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              You Pay
            </Label>
            <div className="border border-border rounded-lg p-2 space-y-3">
              <SelectCurrency
                selectedChain={selectedChain}
                selectedCurrency={selectedCurrency}
                onSelectChain={(chain) => {
                  setSelectedChain(chain);
                }}
                onSelectCurrency={(currency) => {
                  setSelectedCurrency(currency);
                }}
                projectId={projectId}
                chainId={selectedChain.id}
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
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedCurrency.isNative) {
                      const amount = Number(formatEther(balance?.value ?? 0n));
                      const gasBuffer =
                        selectedChain.id === mainnet.id ? 0.001 : 0.000025;
                      setAmount(Math.max(amount - gasBuffer, 0).toFixed(5));
                    } else {
                      // For ERC20 tokens, use the full balance
                      setAmount(balance?.formatted ?? "0");
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20"
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {showConnectButton ? (
            <ConnectButton
              className="w-full h-12 text-lg font-medium"
              size="lg"
            />
          ) : (
            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={Number(amount) <= 0 || !project}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              Pay {amount || "0"} {selectedCurrency.symbol}
            </Button>
          )}

          <TokensReceived
            amount={amount}
            chainId={selectedChain.id}
            projectId={project?.projectId?.toString() || "0"}
            currency={selectedCurrency}
            tokenPrice={project?.token.price || "0"}
            symbol={project?.token.symbol || ""}
          />
        </CardContent>
      </Card>

      {project && (
        <TransactionConfirmationModal
          isOpen={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          amount={amount}
          chain={selectedChain}
          project={project}
          currency={selectedCurrency}
        />
      )}
    </>
  );
}
