import { getClient } from "@/registry/juicebox/common/lib/viem-client";
import { getEthUsdRate } from "@/registry/juicebox/common/lib/eth-price";
import { jbPricesAbi } from "@/registry/juicebox/common/lib/juicebox-abis";
import {
  type Currency,
  JBPRICES_ADDRESS,
} from "@/registry/juicebox/common/lib/juicebox-chains";
import { calculateTokensFromEth } from "@/registry/juicebox/common/lib/juicebox-quote";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { type Project } from "@/registry/juicebox/pay-project-form/hooks/use-projects";

interface Params {
  chainId: number;
  projectId: string | bigint; // Juicebox project ID
  amount: string;
  currency: Currency;
  project: Project;
}

export function useTokenQuote({
  chainId,
  projectId,
  amount,
  currency,
  project,
}: Params) {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  // Public client via helper (browser-safe)
  const client = getClient(chainId);

  useEffect(() => {
    if (!amount || Number(amount) === 0) {
      setQuote("");
      return;
    }

    let cancelled = false;

    const fetchQuote = async () => {
      const { accountingTokenPrice, ethPrice } = project.token;
      try {
        if (ethPrice !== "0" && currency.isNative) {
          // Native currency path - reuse existing util
          const q = calculateTokensFromEth(amount, ethPrice);
          if (!cancelled) setQuote(q);
          return;
        }
        if (
          accountingTokenPrice !== "0" &&
          currency.address === project.accountingToken
        ) {
          const q = calculateTokensFromEth(amount, accountingTokenPrice);
          if (!cancelled) setQuote(q);
          return;
        }

        // Map currency symbol to JB pricing currency ID (USD => 3, default) - expandable
        const pricingCurrencyId = 3n; // USD for stablecoins
        const unitCurrencyId = 1n; // ETH

        const pricesAddr = JBPRICES_ADDRESS;
        const pricesClient = client;

        setLoading(true);
        // Request price (pricingCurrency per unitCurrency) with 18 decimals
        const priceBigInt = (await pricesClient.readContract({
          address: pricesAddr,
          abi: jbPricesAbi,
          functionName: "pricePerUnitOf",
          args: [BigInt(projectId), pricingCurrencyId, unitCurrencyId, 18n],
        })) as bigint;

        const priceDecimal = parseFloat(formatEther(priceBigInt)); // USD per 1 ETH
        if (priceDecimal === 0) {
          throw new Error("Price feed returned 0");
        }

        const ethAmount = parseFloat(amount) / priceDecimal; // ETH equivalent
        const q = calculateTokensFromEth(ethAmount.toString(), ethPrice);
        if (!cancelled) setQuote(q);
      } catch (err) {
        console.error("Failed to fetch quote:", err);

        // Fallback to public ETH-USD rate if available
        const ethUsd = await getEthUsdRate();
        if (ethUsd && ethUsd > 0) {
          const ethAmount = parseFloat(amount) / ethUsd;
          const q = calculateTokensFromEth(ethAmount.toString(), ethPrice);
          if (!cancelled) setQuote(q);
          return;
        }

        // graceful fallback
        if (!cancelled) setQuote("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuote();

    return () => {
      cancelled = true;
    };
  }, [amount, currency, project, chainId]);

  return { quote, loading };
}
