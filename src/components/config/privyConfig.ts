import type { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    showWalletUIs: true,
  },
  loginMethods: ["wallet", "email"],
  appearance: {
    showWalletLoginFirst: true,
  },
};
