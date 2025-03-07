import "./globals.css";
import type { Metadata } from "next";

import NProgressBar from "@/components/ui/nprogress-bar";
import { Toaster } from "sonner";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://usecube.vercel.app"),
  title: "Cube",
  description: "Real World Payments Solution with Crypto",
  keywords: [
    "SGQR",
    "Stablecoins",
    "ERC4626",
    "Paymaster",
    "Basenames",
    "Onchainkit",
  ],
  openGraph: {
    images:
      "https://github.com/usecube/.github/blob/main/assets/png/cube-banner.png?raw=true",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NProgressBar>
            <main className="min-h-screen">
              {children}
              <Toaster />
            </main>
          </NProgressBar>
        </Providers>
      </body>
    </html>
  );
}
