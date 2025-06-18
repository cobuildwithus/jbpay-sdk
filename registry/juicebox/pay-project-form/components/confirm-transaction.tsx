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
import { Chain } from "viem";
import { Project } from "../hooks/use-project";
import { calculateTokensFromEth } from "../lib/quote";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  project: Project;
  chain: Chain;
}

export function TransactionConfirmationModal(props: Props) {
  const { isOpen, onOpenChange, amount, project, chain } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                {amount} {chain.nativeCurrency.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">You Receive:</span>
              <span className="text-lg font-medium">
                ~{calculateTokensFromEth(amount, project.token.price)} {project.token.symbol}
              </span>
            </div>
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

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.debug({ chain, amount, project });
            }}
            className="flex-1"
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
