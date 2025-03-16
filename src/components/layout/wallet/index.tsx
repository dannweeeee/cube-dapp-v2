"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HandCoins, SendHorizonal, Wallet } from "lucide-react";
import PortfolioTable from "./portfolio-table";
import { useAccount } from "wagmi";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Badge } from "@/components/ui/badge";
import { useFundWallet, usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { base } from "viem/chains";
import WalletBalanceCard from "./wallet-balance-card";

export default function WalletComponent() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { portfolioData, isLoading } = usePortfolioData(address, isConnected);
  const { ready, authenticated } = usePrivy();
  const { fundWallet } = useFundWallet({
    onUserExited({ balance }) {
      if (!balance || balance < BigInt(1000)) {
        toast.error("Failed to fund wallet. Please try again.");
      }
    },
  });

  const handleFundWallet = async () => {
    if (!ready || !authenticated) {
      toast.error("Please login / re-login to fund your wallet");
      return;
    }

    try {
      await fundWallet(address as string, {
        chain: base,
        asset: "USDC",
        amount: "20",
        card: {
          preferredProvider: "moonpay",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate funding. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-primary/20 hover:border-primary/30">
          <Wallet className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Wallet</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col items-center gap-4 md:gap-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 w-full">
            <WalletBalanceCard portfolioData={portfolioData} />

            <div className="flex flex-row gap-4 mt-2 sm:mt-0">
              <Button
                onClick={handleFundWallet}
                className="flex flex-col items-center justify-center gap-1 md:gap-2 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-primary/80 to-primary hover:from-primary hover:to-primary/90 shadow-md hover:shadow-xl transition-all duration-300 border-0"
                variant="outline"
              >
                <HandCoins className="h-4 w-4 md:h-5 md:w-5 text-white" />
                <span className="text-white text-xs md:text-sm font-medium">
                  Deposit
                </span>
              </Button>
              <Button
                onClick={() => router.push("/payliao")}
                className="flex flex-col items-center justify-center gap-1 md:gap-2 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300"
              >
                <SendHorizonal className="h-4 w-4 md:h-5 md:w-5 text-white" />
                <span className="text-white text-xs md:text-sm font-medium">
                  Payliao
                </span>
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <PortfolioTable />
          </div>
        </div>
      </div>
    </div>
  );
}
