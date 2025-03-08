"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HandCoins, SendHorizonal, Wallet } from "lucide-react";
import PortfolioTable from "./portfolio-table";
import { useAccount } from "wagmi";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function WalletComponent() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { portfolioData, isLoading } = usePortfolioData(address, isConnected);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
      <Badge className="bg-primary/10 text-primary p-2">
        <Wallet className="w-4 h-4 mr-1" />
        Wallet
      </Badge>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-row items-center justify-between gap-8 w-full">
            <Card className="transition-all duration-200 backdrop-blur-sm bg-transparent shadow-none border-none max-w-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
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

            <div className="flex flex-row gap-4">
              <Button
                onClick={() => router.push("/payliao")}
                className="flex flex-col items-center justify-center gap-2 h-20 w-20 rounded-xl bg-gradient-to-br from-primary/80 to-primary hover:from-primary hover:to-primary/90 shadow-md hover:shadow-xl transition-all duration-300 border-0"
                variant="outline"
              >
                <HandCoins className="h-5 w-5 text-white" />
                <span className="text-white text-sm font-medium">Deposit</span>
              </Button>
              <Button
                onClick={() => router.push("/payliao")}
                className="flex flex-col items-center justify-center gap-2 h-20 w-20 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300"
              >
                <SendHorizonal className="h-5 w-5 text-white" />
                <span className="text-white text-sm font-medium">Payliao</span>
              </Button>
            </div>
          </div>

          <div className="w-full">
            <PortfolioTable />
          </div>
        </div>
      </div>
    </div>
  );
}
