import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/helpers/format-number";
import { useUserUsdcBalance } from "@/hooks/useUserUsdcBalance";
import { useAccount } from "wagmi";

export default function MerchantUsdcBalanceCard() {
  const { address } = useAccount();
  const { balance, isLoading, error } = useUserUsdcBalance(address);
  return (
    <Card className="transition-all duration-200 backdrop-blur-sm shadow-none border-none w-full sm:max-w-md bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          USDC Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-5 w-24" />
            </>
          ) : (
            <>
              <p className="text-2xl md:text-4xl font-bold">
                ${formatNumber(parseFloat(balance))}
              </p>
              <p className="text-sm text-muted-foreground">USDC</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
