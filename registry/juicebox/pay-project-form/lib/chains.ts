import { arbitrum, base, Chain, mainnet, optimism } from "viem/chains";

export const jbChains = [mainnet, base, optimism, arbitrum] as const satisfies Chain[];

export const JBMULTITERMINAL_ADDRESS = "0xdb9644369c79c3633cde70d2df50d827d7dc7dbc" as const;

export const ETH_ADDRESS = "0x000000000000000000000000000000000000EEEe" as const;
