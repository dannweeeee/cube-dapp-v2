import {
  Activity,
  LayoutDashboard,
  ScanQrCode,
  Store,
  Wallet,
} from "lucide-react";

/**
 * NAV LINKS
 */
export const navItems = [
  {
    title: "Home",
    url: "/home",
    segment: "home",
    icon: LayoutDashboard,
    external: false,
  },
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

//////////////////////////////
/////// BASE CONTRACTS ///////
//////////////////////////////

export const BASE_REGISTRAR_CONTROLLER_ADDRESS =
  "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5";
export const BASE_L2_RESOLVER_ADDRESS =
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

//////////////////////////////
/// BASE SEPOLIA CONTRACTS ///
//////////////////////////////

// Basenames Contracts
export const BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS =
  "0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581";
export const BASE_SEPOLIA_L2_RESOLVER_ADDRESS =
  "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";

// Registry Contract
export const BASE_SEPOLIA_REGISTRY_ADDRESS =
  "0x2b4836d81370e37030727E4DCbd9cC5a772cf43A";

// USDC Contract
export const BASE_SEPOLIA_USDC_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// XSGD Contract
export const BASE_SEPOLIA_XSGD_ADDRESS =
  "0xd7260d7063fE5A62A90E6A8DD5A39Ab27A05986B";

// Exchange Contract (NEW)
export const BASE_SEPOLIA_EXCHANGE_ADDRESS =
  "0xd9004Edc4bdEB308C4A40fdCbE320bbE5DF4AF77";

// Vault Contract
export const BASE_SEPOLIA_VAULT_ADDRESS =
  "0xd580248163CDD5AE3225A700E9f4e7CD525b27b0";

/**
 * CHAIN ID
 */

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_CHAIN_ID = 8453;
