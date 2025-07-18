"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  jbChains,
  type Currency,
} from "@/registry/juicebox/pay-project-form/lib/chains";
import { Chain } from "viem";
import { useBalance } from "wagmi";
import { useAccount } from "wagmi";
import { useState } from "react";

interface Props {
  selectedChain: Chain;
  selectedCurrency: Currency;
  onSelectChain: (chain: Chain) => void;
  onSelectCurrency: (currency: Currency) => void;
  availableChains?: Chain[];
  availableCurrencies: Currency[];
}

function CurrencyBalance({
  chainId,
  currency,
}: {
  chainId: number;
  currency: Currency;
}) {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId,
    token: currency.isNative ? undefined : currency.address,
  });

  if (!balance) return null;

  const formattedBalance = Number(balance.formatted).toFixed(4);
  return <>{formattedBalance}</>;
}

function ChainBalance({ chainId }: { chainId: number }) {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId,
  });

  if (!balance) return null;

  const formattedBalance = Number(balance.formatted).toFixed(4);
  return <>{formattedBalance}</>;
}

export function SelectCurrency(props: Props) {
  const {
    selectedChain,
    selectedCurrency,
    onSelectChain,
    onSelectCurrency,
    availableChains = jbChains,
    availableCurrencies,
  } = props;

  const [isChainOpen, setIsChainOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  return (
    <div className="flex w-full gap-2">
      {/* Chain Selector */}
      <Popover open={isChainOpen} onOpenChange={setIsChainOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 h-auto p-2 justify-start text-left font-normal hover:bg-transparent cursor-pointer"
            type="button"
          >
            <span className="text-sm text-muted-foreground truncate">
              on {selectedChain.name}
            </span>
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4">
          <h4 className="text-sm font-medium mb-2">Chain</h4>
          <div className="space-y-1">
            {availableChains.map((chain) => (
              <button
                type="button"
                key={chain.id}
                onClick={() => {
                  onSelectChain(chain);
                  setIsChainOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                  {
                    "bg-accent": selectedChain.id === chain.id,
                    "hover:bg-accent/75": selectedChain.id !== chain.id,
                  }
                )}
              >
                <div className="font-medium text-sm">{chain.name}</div>
                <div className="text-xs text-muted-foreground">
                  <ChainBalance chainId={chain.id} />{" "}
                  {chain.nativeCurrency.symbol}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Currency Selector */}
      <Popover open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 h-auto p-2 justify-end text-right font-normal hover:bg-transparent cursor-pointer"
            type="button"
          >
            <span className="text-sm font-medium truncate">
              {selectedCurrency.symbol}
            </span>
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4">
          <h4 className="text-sm font-medium mb-2">Currency</h4>
          <div className="space-y-1">
            {availableCurrencies.map((currency) => (
              <button
                type="button"
                key={currency.address}
                onClick={() => {
                  onSelectCurrency(currency);
                  setIsCurrencyOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                  {
                    "bg-accent": selectedCurrency.address === currency.address,
                    "hover:bg-accent/75":
                      selectedCurrency.address !== currency.address,
                  }
                )}
              >
                <div className="font-medium text-sm">{currency.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  <CurrencyBalance
                    chainId={selectedChain.id}
                    currency={currency}
                  />{" "}
                  {currency.symbol}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
