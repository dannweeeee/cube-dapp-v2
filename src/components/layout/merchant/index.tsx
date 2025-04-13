"use client";

import RegistryAbi from "@/abis/RegistryAbi";
import { Badge } from "@/components/ui/badge";
import { useCheckIfMerchantRegistered } from "@/hooks/useCheckIfMerchantRegistered";
import { useCheckIfMerchantVaultIsEnabledByAddress } from "@/hooks/useCheckIfMerchantVaultIsEnabledByAddress";
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
  const { isMerchantVaultEnabled } = useCheckIfMerchantVaultIsEnabledByAddress(address);

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
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10 max-w-7xl">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Store className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Merchant</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <MerchantXsgdBalanceCard />
            <MerchantUsdcBalanceCard />
          </div>
          <div className="flex items-center justify-center sm:justify-end mt-4 sm:mt-0">
            <MerchantRegistrationModal />
          </div>
        </div>

        {isRegistered ? (
          <div className="space-y-8">
            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1">
                {merchants.map(
                  (merchant: {
                    uen: string;
                    name: string;
                    owner: string;
                    address: string;
                  }) => (
                    <div
                      key={merchant.address}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
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

            <div className="w-full overflow-hidden rounded-xl shadow-md border border-gray-100">
              {isLoading ? (
                <Skeleton className="h-72 w-full rounded-xl" />
              ) : (
                merchants.length > 0 && <MerchantSalesTable />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 shadow-lg rounded-xl p-8 text-center space-y-6 border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/5 rounded-full">
                <Store className="h-14 w-14 text-primary/60" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No Registered Merchants
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-base">
              You don't have any registered merchants yet. Register a merchant
              to start tracking sales and managing your business on the
              blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
