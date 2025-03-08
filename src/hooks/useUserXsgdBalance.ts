import { useState, useEffect } from "react";
import { Address, formatUnits } from "viem";
import { usePublicClient, useBlockNumber } from "wagmi";
import {
  BASE_SEPOLIA_USDC_ADDRESS,
  BASE_SEPOLIA_XSGD_ADDRESS,
} from "@/lib/constants";
import XsgdAbi from "@/abis/XsgdAbi";

export function useUserXsgdBalance(address: Address | undefined) {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

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
          address: BASE_SEPOLIA_XSGD_ADDRESS,
          abi: XsgdAbi,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(formatUnits(result, 18));
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
  }, [address, publicClient, blockNumber]);

  return { balance, isLoading, error };
}
