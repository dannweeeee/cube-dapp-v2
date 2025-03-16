import { useState, useEffect, useCallback } from "react";
import { Address } from "viem";

export function useCheckMerchantIfRegistered(address: Address | undefined) {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkMerchantRegistration = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/get-merchant-by-address?merchant_wallet_address=${address}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch merchant");
      }
      const merchant = await response.json();
      setIsRegistered(!merchant.error);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    checkMerchantRegistration();
  }, [checkMerchantRegistration]);

  return { isRegistered, loading, error };
}
