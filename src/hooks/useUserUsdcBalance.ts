import { useState, useEffect } from "react";
import { Address, formatUnits } from "viem";
import { usePublicClient } from "wagmi";
import { BASE_SEPOLIA_USDC_ADDRESS } from "@/lib/constants";
import UsdcAbi from "@/abis/UsdcAbi";

export function useUserUsdcBalance(address: Address | undefined) {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) {
        setBalance("0");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await publicClient.readContract({
          address: BASE_SEPOLIA_USDC_ADDRESS,
          abi: UsdcAbi,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(formatUnits(result, 6));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("An error occurred while fetching the balance")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, publicClient]);

  return { balance, isLoading, error };
}
