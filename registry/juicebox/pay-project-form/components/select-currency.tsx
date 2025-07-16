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
  SUPPORTED_TOKENS,
  ETH_ADDRESS,
  type Currency,
} from "@/registry/juicebox/pay-project-form/lib/chains";
import { Chain } from "viem";
import { useBalance } from "wagmi";
import { useAccount } from "wagmi";

interface Props {
  selectedChain: Chain;
  selectedCurrency: Currency;
  onSelectChain: (chain: Chain) => void;
  onSelectCurrency: (currency: Currency) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableChains?: Chain[];
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
    isOpen,
    onOpenChange,
    availableChains = jbChains,
  } = props;

  // Get available currencies for the selected chain
  const availableCurrencies: Currency[] = [
    // Native currency (ETH, etc.)
    {
      symbol: selectedChain.nativeCurrency.symbol,
      address: ETH_ADDRESS,
      isNative: true,
    },
    // Supported tokens for this chain
    ...(SUPPORTED_TOKENS[selectedChain.id]
      ? Object.entries(SUPPORTED_TOKENS[selectedChain.id]).map(
          ([symbol, address]) => ({
            symbol,
            address,
            isNative: false,
          })
        )
      : []),
  ];

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-auto p-2 justify-between text-left font-normal hover:bg-transparent cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">
            on {selectedChain.name}
          </span>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{selectedCurrency.symbol}</div>
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
      <PopoverContent className="w-80 p-4 space-y-4">
        {/* Chain Selection */}
        {availableChains.length > 1 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Chain</h4>
            <div className="space-y-1">
              {availableChains.map((chain) => (
                <button
                  type="button"
                  key={chain.id}
                  onClick={() => {
                    onSelectChain(chain);
                    // Reset to native currency when changing chains
                    onSelectCurrency({
                      symbol: chain.nativeCurrency.symbol,
                      address: ETH_ADDRESS,
                      isNative: true,
                    });
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
          </div>
        )}

        {/* Currency Selection */}
        <div>
          <h4 className="text-sm font-medium mb-2">Currency</h4>
          <div className="space-y-1">
            {availableCurrencies.map((currency) => (
              <button
                type="button"
                key={currency.address}
                onClick={() => {
                  onSelectCurrency(currency);
                  onOpenChange(false);
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
