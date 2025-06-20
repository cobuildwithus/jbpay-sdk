"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChainBalance } from "@/registry/juicebox/pay-project-form/components/chain-balance";
import { jbChains } from "@/registry/juicebox/pay-project-form/lib/chains";
import { Chain } from "viem";

interface Props {
  selectedChain: Chain;
  onSelect: (chain: Chain) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SelectChain(props: Props) {
  const { selectedChain, onSelect, isOpen, onOpenChange } = props;
  const { name, nativeCurrency, id } = selectedChain;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-auto p-2 justify-between text-left font-normal hover:bg-transparent cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">on {name}</span>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{nativeCurrency.symbol}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-1">
          {jbChains.map((chain) => (
            <button
              type="button"
              key={chain.id}
              onClick={() => onSelect(chain)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                {
                  "bg-accent": id === chain.id,
                  "hover:bg-accent/75": id !== chain.id,
                }
              )}
            >
              <div className="font-medium text-sm">{chain.name}</div>
              <div className="text-xs text-muted-foreground">
                <ChainBalance chainId={chain.id} /> {nativeCurrency.symbol}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
