import { Activity, ScanQrCode, Store, Wallet } from "lucide-react";

/**
 * NAV LINKS
 */
export const navItems = [
  {
    title: "Wallet",
    url: "/wallet",
    segment: "wallet",
    icon: Wallet,
    external: false,
  },
  {
    title: "Payliao",
    url: "/payliao",
    segment: "payliao",
    icon: ScanQrCode,
    external: false,
  },
  {
    title: "Activity",
    url: "/activity",
    segment: "activity",
    icon: Activity,
    external: false,
  },
  {
    title: "Merchant",
    url: "/merchant",
    segment: "merchant",
    icon: Store,
    external: false,
  },
];

/**
 * CONTRACT ADDRESSES
 */

/////////////////////
/////// BASE  ///////
/////////////////////

export const BASE_CHAIN_ID = 8453;

////////////////////
/// BASE SEPOLIA ///
////////////////////

export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Registry Contract
export const BASE_SEPOLIA_REGISTRY_ADDRESS =
  "0x2b4836d81370e37030727E4DCbd9cC5a772cf43A";

// USDC Contract
export const BASE_SEPOLIA_USDC_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// XSGD Contract
export const BASE_SEPOLIA_XSGD_ADDRESS =
  "0xd7260d7063fE5A62A90E6A8DD5A39Ab27A05986B";

// Exchange Contract (OLD)
export const BASE_SEPOLIA_EXCHANGE_V1_ADDRESS =
  "0xd9004Edc4bdEB308C4A40fdCbE320bbE5DF4AF77";

// Exchange Contract (NEW)
export const BASE_SEPOLIA_EXCHANGE_V2_ADDRESS =
  "0x92F5D70ffBE0988DEcD5c1E7A6cb8A048a3Fe75D";

// Vault Contract
export const BASE_SEPOLIA_VAULT_ADDRESS =
  "0xd580248163CDD5AE3225A700E9f4e7CD525b27b0";
