import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRegistryUrl() {
  const IS_DEVELOPMENT = process.env.VERCEL_ENV === "development";
  const PROTOCOL = IS_DEVELOPMENT ? "http" : "https";
  const URL = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
  return `${PROTOCOL}://${URL}/r`;
}
