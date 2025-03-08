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
import { formatNumber } from "@/lib/utils";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingDown, TrendingUp, Coins } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PortfolioTable() {
  const { address, isConnected } = useAccount();
  const { portfolioData, isLoading, error } = usePortfolioData(
    address,
    isConnected
  );

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="mt-6 border border-destructive/20 shadow-sm"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-medium">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isConnected) {
    return (
      <Alert className="mt-6 border border-primary/20 bg-primary/5 shadow-sm">
        <AlertDescription className="font-medium flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          Please connect your wallet to view your portfolio.
        </AlertDescription>
      </Alert>
    );
  }

  // Define empty state for initial load
  const emptyTokens = [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "XSGD", name: "XSGD" },
  ];

  return (
    <Card className="overflow-hidden border shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Assets
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Your current portfolio breakdown
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
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
              {!portfolioData?.tokens.length
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
                : portfolioData.tokens
                    .sort((a, b) => b.value - a.value)
                    .map((token) => (
                      <TableRow
                        key={token.symbol}
                        className={cn(
                          "hover:bg-primary/5 transition-colors",
                          isLoading && "animate-pulse"
                        )}
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
      </CardContent>
      <div className="p-6 border-t bg-background/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total Portfolio Value
          </span>
          {portfolioData ? (
            <span className="text-lg font-semibold">
              ${formatNumber(portfolioData.totalValue)}
            </span>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
        </div>
      </div>
    </Card>
  );
}
