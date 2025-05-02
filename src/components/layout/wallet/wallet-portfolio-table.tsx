"use client";

import { useAccount } from "wagmi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/helpers/format-number";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Coins } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEffect, useState } from "react";
import { TokenCardMobile } from "./token-card-mobile";

export default function WalletPortfolioTable() {
  const { address, isConnected } = useAccount();
  const { portfolioData, isLoading, error } = usePortfolioData(
    address,
    isConnected
  );
  const isMobile = useIsMobile();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [displayData, setDisplayData] = useState(portfolioData);

  useEffect(() => {
    if (!isLoading) {
      setDisplayData(portfolioData);
      setIsInitialLoading(false);
    }
  }, [isLoading, portfolioData]);

  if (error) {
    return (
      <Alert variant="destructive" className="border-none shadow-none">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-medium">{error}</AlertDescription>
      </Alert>
    );
  }

  const emptyTokens = [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "XSGD", name: "XSGD" },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl w-full overflow-hidden">
      <div className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Assets
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your current portfolio breakdown
            </p>
          </div>
        </div>
      </div>

      <div className="p-0">
        {isMobile ? (
          <div>
            {!isConnected || isInitialLoading || !displayData?.tokens.length
              ? emptyTokens.map((token) => (
                  <TokenCardMobile
                    key={token.symbol}
                    token={token}
                    isLoading={true}
                    isEmptyState={true}
                  />
                ))
              : displayData.tokens
                  .sort((a, b) => b.value - a.value)
                  .map((token) => (
                    <TokenCardMobile key={token.symbol} token={token} />
                  ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-primary/10">
                  <TableHead className="w-[250px] font-semibold text-primary">
                    Asset
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Price
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Holdings
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Value
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Allocation
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isConnected || isInitialLoading || !displayData?.tokens.length
                  ? emptyTokens.map((token) => (
                      <TableRow
                        key={token.symbol}
                        className="hover:bg-transparent animate-pulse"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {token.symbol.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{token.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {token.symbol}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <Skeleton className="h-4 w-16" />
                            <span className="text-xs text-muted-foreground">
                              USD
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <Skeleton className="h-4 w-16" />
                            <span className="text-xs text-muted-foreground">
                              {token.symbol}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="w-24 h-2 bg-primary/10 rounded-full" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : displayData.tokens
                      .sort((a, b) => b.value - a.value)
                      .map((token) => (
                        <TableRow
                          key={token.symbol}
                          className="hover:bg-primary/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {token.symbol.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {token.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {token.symbol}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                ${formatNumber(token.price)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                USD
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {formatNumber(token.balance)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {token.symbol}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span className="text-foreground">
                              ${formatNumber(token.value)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-medium">
                                {token.percentage.toFixed(2)}%
                              </span>
                              <div className="w-24 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 ease-in-out"
                                  style={{ width: `${token.percentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
