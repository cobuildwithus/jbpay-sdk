"use client";

import { useTokenQuote } from "@/registry/juicebox/pay-project-form/hooks/use-token-quote";
import { type Currency } from "@/registry/juicebox/common/lib/juicebox-chains";
import { type Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";

interface Props {
  amount: string;
  chainId: number;
  currency: Currency;
  project: Project;
  symbol: string;
}

export function TokensReceived(props: Props) {
  const { amount, chainId, currency, project, symbol } = props;

  const { quote: tokenQuote } = useTokenQuote({
    chainId,
    amount,
    currency,
    project,
  });

  return (
    <>
      {tokenQuote && (
        <div
          className={`text-center text-sm text-muted-foreground transition-opacity duration-300 -mt-2.5 ${
            amount && Number.parseFloat(amount) > 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          You'll receive ~{tokenQuote} {symbol}
        </div>
      )}
    </>
  );
}
