import { useState, useEffect } from "react";
import { Merchant } from "@/lib/types";
import { Address } from "viem";

export function useCheckIfMerchantVaultIsEnabledByAddress(
  merchantWalletAddress: Address | undefined
) {
  const [isMerchantVaultEnabled, setIsMerchantVaultEnabled] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMerchantVaultStatus() {
      if (!merchantWalletAddress) {
        setIsMerchantVaultEnabled(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-merchant-by-address?merchant_wallet_address=${merchantWalletAddress}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            credentials: "same-origin",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch merchant");
        }
        const data: Merchant = await response.json();
        console.log("Merchant data:", data);
        setIsMerchantVaultEnabled(data.is_vault_enabled);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setIsMerchantVaultEnabled(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMerchantVaultStatus();
  }, [merchantWalletAddress]);

  return { isMerchantVaultEnabled, loading, error };
}
