import { formatEther, parseEther, parseUnits } from "viem";
import { Currency } from "./juicebox-chains";

export function calculateTokensFromEth(ethAmount: string, price: string): string {
  if (!price || !ethAmount || ethAmount === "") return "";

  try {
    const payAmountWei = parseEther(ethAmount);
    const priceWei = BigInt(price);

    if (priceWei === 0n) return "0";

    const tokens = (payAmountWei * BigInt(1e18)) / priceWei;
    const tokensFormatted = formatEther(tokens);

    const rounded = Number.parseFloat(tokensFormatted).toFixed(2);
    return Number.parseFloat(rounded).toString();
  } catch (error) {
    return "";
  }
}

export function normalizeAmount(amount: string, currency: Currency): bigint {
  if (currency.isNative) return parseEther(amount);

  try {
    return parseUnits(amount, currency.decimals);
  } catch (e) {
    console.error("Error reading token decimals:", e);
    return parseEther(amount);
  }
}
