import { useState, useEffect } from "react";
import { Address, formatEther } from "viem";
import { usePublicClient } from "wagmi";

export function useUserEthBalance(address: Address | undefined) {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setBalance("0");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await publicClient?.getBalance({
          address: address,
        });
        if (result) {
          setBalance(formatEther(result));
        } else {
          setBalance("0");
        }
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
