"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Chain } from "viem";
import { useAccount } from "wagmi";
import { usePayProject } from "@/registry/juicebox/pay-project-form/hooks/use-pay-project";
import { Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";
import { type Currency } from "@/registry/juicebox/pay-project-form/lib/chains";
import { useTokenQuote } from "@/registry/juicebox/pay-project-form/hooks/use-token-quote";
import { ConnectButton } from "@/registry/juicebox/pay-project-form/components/connect-button";
import { useState, useEffect } from "react";
import { Status } from "../hooks/use-transaction-status";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  project: Project;
  chain: Chain;
  currency: Currency;
}

export function TransactionConfirmationModal(props: Props) {
  const { isOpen, onOpenChange, amount, project, chain, currency } = props;
  const {
    payProject,
    approveToken,
    checkAllowance,
    errorMessage,
    status,
    reset,
  } = usePayProject(chain.id, BigInt(project.projectId));
  const { address } = useAccount();
  const [requiresApproval, setRequiresApproval] = useState(false);

  // Quote tokens to receive
  const { quote: tokenQuote } = useTokenQuote({
    chainId: chain.id,
    projectId: project.projectId.toString(),
    amount,
    currency,
    tokenPrice: project.token.price,
  });

  // Check allowance when modal opens or currency changes
  useEffect(() => {
    if (isOpen && !currency.isNative && address) {
      checkAllowance(currency.address, amount, currency.isNative).then(
        (hasAllowance) => {
          setRequiresApproval(!hasAllowance);
        }
      );
    }
  }, [isOpen, currency, amount, address, checkAllowance]);

  // Recheck allowance after successful approval
  useEffect(() => {
    if (
      status === "idle" &&
      requiresApproval &&
      !currency.isNative &&
      address
    ) {
      // This will run after approval success when status returns to idle
      checkAllowance(currency.address, amount, currency.isNative).then(
        (hasAllowance) => {
          setRequiresApproval(!hasAllowance);
        }
      );
    }
  }, [status, requiresApproval, currency, amount, address, checkAllowance]);

  const closeModal = () => {
    reset();
    setRequiresApproval(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Review your payment details before confirming the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Project:</span>
            <span className="text-sm font-medium">{project.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Project ID:</span>
            <span className="text-sm font-medium">{project.projectId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Network:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{chain.name}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You Pay:</span>
              <span className="text-lg font-medium">
                {amount} {currency.symbol}
              </span>
            </div>
            {tokenQuote && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">
                  You Receive:
                </span>
                <span className="text-lg font-medium">
                  ~{tokenQuote} {project.token.symbol}
                </span>
              </div>
            )}
          </div>

          {project.token.disclosure && project.token.disclosure.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="bg-accent dark:bg-muted rounded-lg p-3">
                <p className="text-sm text-accent-foreground dark:text-muted-foreground leading-relaxed">
                  {project.token.disclosure}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              {!address && (
                <ConnectButton variant="outline" className="flex-1">
                  Connect Wallet
                </ConnectButton>
              )}
              {address && (
                <>
                  {requiresApproval && !currency.isNative ? (
                    <Button
                      onClick={() => {
                        approveToken(currency.address, amount);
                      }}
                      className="flex-1"
                      disabled={status === "pending" || status === "confirming"}
                    >
                      {status === "pending" || status === "confirming"
                        ? "Approving..."
                        : `Approve ${currency.symbol}`}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        payProject({
                          projectId: BigInt(project.projectId),
                          token: currency.address,
                          amount,
                          beneficiary: address,
                          currency,
                        });
                      }}
                      className="flex-1"
                      disabled={status === "pending" || status === "confirming"}
                    >
                      {status === "pending" || status === "confirming"
                        ? "Processing..."
                        : "Confirm Payment"}
                    </Button>
                  )}
                </>
              )}
            </div>
            <div
              className={cn(
                "text-xs text-muted-foreground text-center min-h-4 -mt-1",
                {
                  "text-destructive": status === "error",
                  "animate-pulse":
                    status === "pending" ||
                    status === "connecting" ||
                    status === "confirming",
                }
              )}
            >
              {getStatusMessage(status, errorMessage)}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getStatusMessage(status: Status, errorMessage: string) {
  switch (status) {
    case "idle":
      return "";
    case "connecting":
    case "pending":
      return "Please confirm transaction...";
    case "confirming":
      return "Transaction in progress...";
    case "success":
      return "Transaction confirmed!";
    case "error":
      return "Error: " + errorMessage.replace("User ", "You ");
  }
}
