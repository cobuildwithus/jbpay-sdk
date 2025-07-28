"use client";

import { useTokenQuote } from "@/registry/juicebox/pay-project-form/hooks/use-token-quote";
import { type Currency } from "@/registry/juicebox/common/lib/juicebox-chains";

interface Props {
  amount: string;
  chainId: number;
  projectId: string;
  currency: Currency;
  tokenPrice: string;
  symbol: string;
}

export function TokensReceived(props: Props) {
  const { amount, chainId, projectId, currency, tokenPrice, symbol } = props;

  const { quote: tokenQuote } = useTokenQuote({
    chainId,
    projectId,
    amount,
    currency,
    tokenPrice,
  });

  console.log("tokenQuote", tokenQuote);
  console.log("amount", amount);
  console.log("chainId", chainId);
  console.log("projectId", projectId);
  console.log("currency", currency);
  console.log("tokenPrice", tokenPrice);
  console.log("symbol", symbol);

  return (
    <>
      {tokenQuote && (
        <div
          className={`text-center text-sm text-muted-foreground transition-opacity duration-300 -mt-2.5 ${
            amount && Number.parseFloat(amount) > 0
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          You'll receive ~{tokenQuote} {symbol}
        </div>
      )}
    </>
  );
}
