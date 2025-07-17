import { useEffect, useState } from "react";
import { formatEther } from "viem";
import {
  type Currency,
  JBPRICES_ADDRESS,
} from "@/registry/juicebox/pay-project-form/lib/chains";
import { getClient } from "@/lib/client";
import { jbPricesAbi } from "@/registry/juicebox/pay-project-form/lib/abis";
import { calculateTokensFromEth } from "@/registry/juicebox/pay-project-form/lib/quote";

interface Params {
  chainId: number;
  projectId: string | bigint; // Juicebox project ID
  amount: string;
  currency: Currency;
  tokenPrice: string; // price of project token in wei
}

export function useTokenQuote({
  chainId,
  projectId,
  amount,
  currency,
  tokenPrice,
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
      try {
        if (currency.isNative) {
          // Native currency path - reuse existing util
          const q = calculateTokensFromEth(amount, tokenPrice);
          if (!cancelled) setQuote(q);
          return;
        }

        // Map currency symbol to JB pricing currency ID (USD => 3, default) - expandable
        const pricingCurrencyId = 3n; // USD for stablecoins
        const unitCurrencyId = 1n; // ETH

        const pricesAddr = JBPRICES_ADDRESS;
        const pricesClient = client;

        if (!pricesClient) {
          // Cannot read without a client (unlikely but guard)
          const q = calculateTokensFromEth(amount, tokenPrice);
          if (!cancelled) setQuote(q);
          return;
        }

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
        const q = calculateTokensFromEth(ethAmount.toString(), tokenPrice);
        if (!cancelled) setQuote(q);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
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
  }, [amount, currency, tokenPrice, chainId]);

  return { quote, loading };
}
