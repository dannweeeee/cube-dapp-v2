"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HandCoins, SendHorizonal, Wallet } from "lucide-react";
import WalletPortfolioTable from "./wallet-portfolio-table";
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
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10 max-w-7xl">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Wallet className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Wallet</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <WalletBalanceCard portfolioData={portfolioData} />
          </div>
          <div className="flex items-center justify-center sm:justify-end mt-4 sm:mt-0 gap-4">
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

        <div className="w-full overflow-hidden rounded-xl">
          <WalletPortfolioTable />
        </div>
      </div>
    </div>
  );
}
