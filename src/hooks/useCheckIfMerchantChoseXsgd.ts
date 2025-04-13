import { useState, useEffect } from "react";
import { Merchant } from "@/lib/types";
import { Address } from "viem";

export function useCheckIfMerchantChoseXsgd(uen: string) {
  const [isMerchantChoseXsgd, setIsMerchantChoseXsgd] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMerchantChoseXsgd() {
      if (!uen) {
        setIsMerchantChoseXsgd(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/get-merchant-by-uen?uen=${uen}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          credentials: "same-origin",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch merchant");
        }
        const data: Merchant = await response.json();
        setIsMerchantChoseXsgd(data.prefer_xsgd);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setIsMerchantChoseXsgd(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMerchantChoseXsgd();
  }, [uen]);

  return { isMerchantChoseXsgd, loading, error };
}
