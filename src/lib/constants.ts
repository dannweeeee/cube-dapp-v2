import {
  Activity,
  LayoutDashboard,
  PiggyBank,
  ScanQrCode,
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
    title: "Vaults",
    url: "/vaults",
    segment: "vaults",
    icon: PiggyBank,
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
];
