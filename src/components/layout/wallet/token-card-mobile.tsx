import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/helpers/format-number";

interface TokenCardProps {
  token: {
    symbol: string;
    name: string;
    price?: number;
    balance?: number;
    value?: number;
    percentage?: number;
  };
  isLoading?: boolean;
  isEmptyState?: boolean;
}

export function TokenCardMobile({
  token,
  isLoading = false,
  isEmptyState = false,
}: TokenCardProps) {
  return (
    <div
      className={cn(
        "p-4 border-b border-primary/10",
        isLoading && "animate-pulse"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {token.symbol.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{token.name}</span>
          <span className="text-xs text-muted-foreground">{token.symbol}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-muted-foreground block">Price</span>
          {isEmptyState ? (
            <Skeleton className="h-4 w-16 mt-1" />
          ) : (
            <span className="font-medium">
              ${formatNumber(token.price || 0)}
            </span>
          )}
        </div>

        <div>
          <span className="text-xs text-muted-foreground block">Holdings</span>
          {isEmptyState ? (
            <Skeleton className="h-4 w-16 mt-1" />
          ) : (
            <span className="font-medium">
              {formatNumber(token.balance || 0)} {token.symbol}
            </span>
          )}
        </div>

        <div>
          <span className="text-xs text-muted-foreground block">Value</span>
          {isEmptyState ? (
            <Skeleton className="h-4 w-20 mt-1" />
          ) : (
            <span className="font-medium">
              ${formatNumber(token.value || 0)}
            </span>
          )}
        </div>

        <div>
          <span className="text-xs text-muted-foreground block">
            Allocation
          </span>
          <div className="flex items-center gap-2 mt-1">
            {isEmptyState ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <span className="font-medium">
                {(token.percentage || 0).toFixed(2)}%
              </span>
            )}
            <div className="w-16 h-2 bg-primary/10 rounded-full overflow-hidden">
              {!isEmptyState && (
                <div
                  className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${token.percentage || 0}%` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
