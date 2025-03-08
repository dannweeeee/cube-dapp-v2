"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HandCoins, SendHorizonal, Wallet } from "lucide-react";
import PortfolioTable from "./portfolio-table";
import { useAccount } from "wagmi";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletComponent() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { portfolioData, isLoading } = usePortfolioData(address, isConnected);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
        <Wallet className="w-4 h-4 mr-1" />
        Wallet
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow max-w-3xl">
            <Card className="transition-all duration-200 bg-white/80 backdrop-blur-sm border shadow-sm hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  {isLoading || !portfolioData ? (
                    <>
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-5 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold">
                        ${formatNumber(portfolioData.totalValue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {portfolioData.tokens.length} Assets
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-row gap-4 w-full lg:w-auto">
            <Button
              onClick={() => router.push("/payliao")}
              className="flex flex-col items-center justify-center gap-2 h-28 w-28 transition-all duration-200 hover:shadow-lg"
              variant="outline"
            >
              <HandCoins className="h-6 w-6" />
              <span>Deposit</span>
            </Button>
            <Button
              onClick={() => router.push("/payliao")}
              className="flex flex-col items-center justify-center gap-2 h-28 w-28 transition-all duration-200 hover:shadow-lg"
            >
              <SendHorizonal className="h-6 w-6" />
              <span>Payliao</span>
            </Button>
          </div>
        </div>

        <div className="w-full">
          <PortfolioTable />
        </div>
      </div>
    </div>
  );
}
