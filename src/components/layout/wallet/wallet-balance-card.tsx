import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioData } from "@/hooks/usePortfolioData";
import { formatNumber } from "@/lib/utils";

export default function WalletBalanceCard({
  portfolioData,
}: {
  portfolioData: PortfolioData | null;
}) {
  return (
    <Card className="transition-all duration-200 backdrop-blur-sm bg-transparent shadow-none border-none w-full sm:max-w-md bg-white/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {!portfolioData ? (
            <>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-5 w-24" />
            </>
          ) : (
            <>
              <p className="text-2xl md:text-4xl font-bold">
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
  );
}
