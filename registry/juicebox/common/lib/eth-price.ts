"use client";

const STORAGE_KEY = "eth_usd_rate";
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

interface StoredRate {
  rate: number;
  timestamp: number;
}

function getCachedRate(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredRate = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > EXPIRY_MS) return null;
    return parsed.rate;
  } catch {
    return null;
  }
}

async function fetchRate(): Promise<number | null> {
  try {
    const res = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
    if (!res.ok) return null;
    const json = await res.json();
    const rate = Number.parseFloat(json?.data?.amount);
    return rate && !Number.isNaN(rate) ? rate : null;
  } catch {
    return null;
  }
}

export async function getEthUsdRate(): Promise<number | null> {
  const cached = getCachedRate();
  if (cached) return cached;
  const fresh = await fetchRate();
  if (fresh && typeof window !== "undefined") {
    try {
      const toStore: StoredRate = { rate: fresh, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {}
  }
  return fresh;
}
