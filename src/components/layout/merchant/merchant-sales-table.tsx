import RegistryAbi from "@/abis/RegistryAbi";
import { useFetchMerchantTransactionsByUen } from "@/hooks/useFetchMerchantTransactionsByUen";
import { BASE_SEPOLIA_REGISTRY_ADDRESS } from "@/lib/constants";
import { Transaction } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useCheckIfMerchantRegistered } from "@/hooks/useCheckIfMerchantRegistered";

export default function MerchantSalesTable() {
  const { address } = useAccount();
  const { isRegistered } = useCheckIfMerchantRegistered(address);

  const { data } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantsByWalletAddress",
    args: [address as `0x${string}`],
  });

  const uens = useMemo(() => {
    return data && data.length > 0 ? data.map((merchant) => merchant.uen) : [];
  }, [data]);

  const { transactions, loading, error } =
    useFetchMerchantTransactionsByUen(uens);

  return (
    <Card className="bg-white/50 shadow rounded-lg p-4">
      <CardHeader>
        <CardTitle>Merchant Sales</CardTitle>
        <CardDescription>
          Recent transactions for your merchant account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : !transactions ||
          !Array.isArray(transactions) ||
          transactions.length === 0 ||
          error ? (
          <div className="text-gray-500 text-center p-4">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4">
            {[...transactions]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((transaction: Transaction, index: number) => (
                <div key={index} className="bg-white/50 shadow rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        To: {transaction.merchant_uen}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(transaction.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ${Number(transaction.amount).toFixed(2)} SGD
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <a
                      href={`https://sepolia.basescan.org/tx/${transaction.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-500 transition-colors"
                    >
                      View on BaseScan
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
