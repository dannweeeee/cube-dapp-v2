import { useState, useEffect } from "react";
import { Address } from "viem";
import { useUserEthBalance } from "./useUserEthBalance";
import { useUserUsdcBalance } from "./useUserUsdcBalance";
import { useUserXsgdBalance } from "./useUserXsgdBalance";
import { usePublicClient, useBlockNumber } from "wagmi";

interface TokenData {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  percentage: number;
}

interface PortfolioData {
  tokens: TokenData[];
  totalValue: number;
}

export function usePortfolioData(address: Address | undefined, ready: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Only pass the address to the hooks if we're ready and have an address
  const shouldFetch = ready && address;

  const {
    balance: ethBalance,
    isLoading: ethLoading,
    error: ethError,
  } = useUserEthBalance(shouldFetch ? address : undefined);

  const {
    balance: usdcBalance,
    isLoading: usdcLoading,
    error: usdcError,
  } = useUserUsdcBalance(shouldFetch ? address : undefined);

  const {
    balance: xsgdBalance,
    isLoading: xsgdLoading,
    error: xsgdError,
  } = useUserXsgdBalance(shouldFetch ? address : undefined);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!shouldFetch) {
        setPortfolioData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Convert balances to numbers
        const balances = [
          { symbol: "ETH", name: "Ethereum", balance: parseFloat(ethBalance) },
          {
            symbol: "USDC",
            name: "USD Coin",
            balance: parseFloat(usdcBalance),
          },
          { symbol: "XSGD", name: "XSGD", balance: parseFloat(xsgdBalance) },
        ];

        // TODO: Replace with actual price fetching logic
        // Using mock prices for now
        const mockPrices = new Map([
          ["ETH", 3500],
          ["USDC", 1],
          ["XSGD", 0.74], // Approximate SGD to USD conversion
        ]);

        // Calculate values and percentages
        const tokens = balances.map((token) => {
          const price = mockPrices.get(token.symbol) || 0;
          const value = token.balance * price;
          return {
            ...token,
            price,
            value,
            percentage: 0, // Will be calculated after total
          };
        });

        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

        // Calculate percentages
        tokens.forEach((token) => {
          token.percentage =
            totalValue > 0 ? (token.value / totalValue) * 100 : 0;
        });

        setPortfolioData({ tokens, totalValue });
      } catch (err) {
        setError("Failed to fetch portfolio data. Please try again.");
        console.error("Error fetching portfolio data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if all balance loading is complete
    if (!ethLoading && !usdcLoading && !xsgdLoading) {
      fetchPortfolioData();
    }
  }, [
    shouldFetch,
    ethBalance,
    usdcBalance,
    xsgdBalance,
    ethLoading,
    usdcLoading,
    xsgdLoading,
    blockNumber, // Add blockNumber dependency to refresh on new blocks
  ]);

  // Combine errors if any exist
  useEffect(() => {
    const errors = [ethError, usdcError, xsgdError]
      .filter((err): err is Error => err !== null)
      .map((err) => err.message);

    if (errors.length > 0) {
      setError(errors.join(", "));
    }
  }, [ethError, usdcError, xsgdError]);

  return {
    isLoading: isLoading || ethLoading || usdcLoading || xsgdLoading,
    portfolioData,
    error,
  };
}
