"use client";

import RegistryAbi from "@/abis/RegistryAbi";
import { Badge } from "@/components/ui/badge";
import { useCheckIfMerchantRegistered } from "@/hooks/useCheckIfMerchantRegistered";
import { useCheckIfMerchantVaultIsEnabled } from "@/hooks/useCheckIfMerchantVaultIsEnabled";
import { BASE_SEPOLIA_REGISTRY_ADDRESS } from "@/lib/constants";
import { Store } from "lucide-react";
import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import MerchantDetailsCard from "./merchant-details-card";
import MerchantVaultBalanceCard from "./merchant-vault-balance-card";
import MerchantSalesTable from "./merchant-sales-table";
import MerchantRegistrationModal from "./merchant-registration-modal";
import { Skeleton } from "@/components/ui/skeleton";
import MerchantXsgdBalanceCard from "./merchant-xsgd-balance-card";
import MerchantUsdcBalanceCard from "./merchant-usdc-balance-card";

export default function MerchantComponent() {
  const { address } = useAccount();
  const { isRegistered } = useCheckIfMerchantRegistered(address);
  const { isMerchantVaultEnabled } = useCheckIfMerchantVaultIsEnabled(address);

  const { data, isLoading } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantsByWalletAddress",
    args: [address as `0x${string}`],
  });

  const merchants = useMemo(() => {
    return data && data.length > 0
      ? data.map(
          (merchant: {
            uen: string;
            entity_name: string;
            owner_name: string;
            wallet_address: string;
          }) => ({
            uen: merchant.uen,
            name: merchant.entity_name,
            owner: merchant.owner_name,
            address: merchant.wallet_address,
          })
        )
      : [];
  }, [data]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-primary/20 hover:border-primary/30">
          <Store className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Merchant</span>
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row w-1/2">
          <MerchantXsgdBalanceCard />
          <MerchantUsdcBalanceCard />
        </div>
        <div className="flex items-center justify-center sm:justify-end">
          <MerchantRegistrationModal />
        </div>
      </div>

      {isRegistered ? (
        <>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {merchants.map(
                (merchant: {
                  uen: string;
                  name: string;
                  owner: string;
                  address: string;
                }) => (
                  <div key={merchant.address}>
                    <MerchantDetailsCard
                      uen={merchant.uen}
                      name={merchant.name}
                    />
                    {isMerchantVaultEnabled && (
                      <MerchantVaultBalanceCard
                        uen={merchant.uen}
                        name={merchant.name}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              merchants.length > 0 && <MerchantSalesTable />
            )}
          </div>
        </>
      ) : (
        <div className="bg-white/50 shadow rounded-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No Registered Merchants
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You don't have any registered merchants yet. Register a merchant to
            start tracking sales and managing your business onchain.
          </p>
        </div>
      )}
    </div>
  );
}
